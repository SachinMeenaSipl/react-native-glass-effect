#!/usr/bin/env bash
# Type-check the iOS ObjC++ sources on Linux/macOS WITHOUT Xcode, using clang -fsyntax-only.
#
# Compiles against REAL headers:
#   - iPhoneOS 16.5 SDK headers (github.com/theos/sdks)
#   - React Native headers from node_modules (laid out like CocoaPods' Headers/Public)
#   - RN's pinned third-party headers: folly, fmt, glog, double-conversion, fast_float, boost
#   - codegen output for src/specs (iOS)
# The iOS 26 branch is compiled a second time with UIGlassEffect declared as Apple documents
# it (uiglass26.h), because the 16.5 SDK predates it.
#
# First run downloads ~120 MB into .cache/ (git sparse clones). Later runs take seconds.
# Requires: clang (any recent version), git, node.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$HERE/../.."
RN="$ROOT/node_modules/react-native"
C="$HERE/.cache"; D="$C/deps"; INC="$C/inc"
mkdir -p "$D" "$INC"
command -v clang++ >/dev/null || { echo "✖ clang++ not found"; exit 1; }

sparse() { # repo tag dir paths...
  local repo=$1 tag=$2 dir=$3; shift 3
  [ -d "$dir" ] && return 0
  git clone -q --depth 1 --filter=blob:none --sparse --branch "$tag" "$repo" "$dir" 2>/dev/null
  (cd "$dir" && git sparse-checkout set --no-cone "$@" >/dev/null && git checkout -q 2>/dev/null || true)
}

echo "↓ headers (cached after first run)"
if [ ! -d "$C/sdks" ]; then
  git clone -q --filter=blob:none --no-checkout --depth 1 https://github.com/theos/sdks "$C/sdks"
  (cd "$C/sdks" && git sparse-checkout init --no-cone >/dev/null &&
   git sparse-checkout set '/iPhoneOS16.5.sdk/usr/include/*' '/iPhoneOS16.5.sdk/System/Library/Frameworks/*/Headers/*' '/iPhoneOS16.5.sdk/System/Library/Frameworks/*/Modules/*' >/dev/null &&
   git checkout -q)
fi
SDK="$C/sdks/iPhoneOS16.5.sdk"
sparse https://github.com/facebook/folly.git v2024.11.18.00 "$D/folly" '/folly/*'
sparse https://github.com/fmtlib/fmt.git 11.0.2 "$D/fmt" '/include/*'
sparse https://github.com/google/double-conversion.git v1.1.6 "$D/double-conversion" '/src/*'
sparse https://github.com/fastfloat/fast_float.git v8.0.0 "$D/fast_float" '/include/*'
sparse https://github.com/google/glog.git v0.3.5 "$D/glog" '/src/*'
for lib in preprocessor config; do
  [ -d "$D/boost/$lib" ] || git clone -q --depth 1 --branch boost-1.84.0 "https://github.com/boostorg/$lib.git" "$D/boost/$lib" 2>/dev/null
done
mkdir -p "$D/double-conversion/inc" && ln -sfn "$D/double-conversion/src" "$D/double-conversion/inc/double-conversion"

# glog 0.3.5 ships .h.in templates; fill them like its configure does on Apple platforms.
python3 - "$D/glog/src/glog" <<'PY'
import re, glob, sys, os
vals = {'ac_google_namespace':'google','ac_google_start_namespace':'namespace google {','ac_google_end_namespace':'}',
 'ac_cv_have_unistd_h':'1','ac_cv_have_stdint_h':'1','ac_cv_have_systypes_h':'1','ac_cv_have_inttypes_h':'1',
 'ac_cv_have_uint16_t':'1','ac_cv_have_u_int16_t':'1','ac_cv_have___uint16':'0','ac_cv_have_libgflags':'0',
 'ac_cv___attribute___noreturn':'__attribute__ ((noreturn))','ac_cv___attribute___noinline':'__attribute__ ((noinline))',
 'ac_cv___attribute___printf_4_5':'__attribute__((__format__ (__printf__, 4, 5)))','ac_cv_cxx_using_operator':'1',
 'ac_cv_have___builtin_expect':'1'}
for f in glob.glob(os.path.join(sys.argv[1], '*.h.in')):
    s = re.sub(r'@(\w+)@', lambda m: vals.get(m.group(1), m.group(0)), open(f).read())
    open(f[:-3], 'w').write(s)
PY

# RN headers, laid out like CocoaPods.
rm -rf "$INC" && mkdir -p "$INC/React"
find "$RN/React" "$RN/Libraries" -name "*.h" -not -path "*/Tests/*" -exec ln -sf {} "$INC/React/" \;
for pair in RCTRequired:Libraries/Required RCTTypeSafety:Libraries/TypeSafety FBLazyVector:Libraries/FBLazyVector/FBLazyVector RCTDeprecation:ReactApple/Libraries/RCTFoundation/RCTDeprecation/Exported; do
  name=${pair%%:*}; src="$RN/${pair#*:}"; mkdir -p "$INC/$name"
  [ -d "$src" ] && find "$src" -maxdepth 1 -name "*.h" -exec ln -sf {} "$INC/$name/" \;
done
[ -f "$INC/RCTDeprecation/RCTDeprecation.h" ] || ln -sf "$(find "$RN" -name RCTDeprecation.h | head -1)" "$INC/RCTDeprecation/RCTDeprecation.h"

node "$ROOT/tools/android-typecheck/gen-spec.js" ios
# Own include dir: copying codegen's react/ into $INC would merge it into React/ on case-insensitive disks.
CG="$C/codegen"
mkdir -p "$INC/RNLiquidGlassSpec" && cp "$C/codegen/RNLiquidGlassSpec/"* "$INC/RNLiquidGlassSpec/"

RC="$RN/ReactCommon"
PLAT=$( (find "$RC" -type d -path "*/platform/ios"; find "$RC" -type d -path "*/platform/cxx") | grep -v /tests/ | sed 's/^/-I /' | tr '\n' ' ')
BOOST=$(for d in "$D"/boost/*/include; do printf -- "-I %s " "$d"; done)
FLAGS="-fsyntax-only -x objective-c++ -std=c++20 -fobjc-arc -Werror -target arm64-apple-ios15.1 -isysroot $SDK -F $SDK/System/Library/Frameworks
 -DFOLLY_NO_CONFIG=1 -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DRCT_NEW_ARCH_ENABLED=1
 -I $INC -I $CG -I $RC -I $RN/React -I $RN/ReactApple/Libraries/RCTFoundation -I $RC/jsi -I $RC/callinvoker -I $RC/runtimeexecutor
 -I $RC/yoga -I $RC/react/nativemodule/core -I $RC/jsiexecutor -I $RC/cxxreact $PLAT
 -I $D/glog/src -I $D/folly -I $D/fmt/include -I $D/double-conversion/inc -I $D/fast_float/include $BOOST"

fail=0
for f in "$ROOT"/ios/*.mm; do
  printf "▶ %-40s" "$(basename "$f")"
  if clang++ $FLAGS "$f"; then echo "✔"; else fail=1; fi
done
printf "▶ %-40s" "LiquidGlassViewComponentView (iOS 26)"
if clang++ $FLAGS -Wno-nullability-completeness -include "$HERE/uiglass26.h" -D__IPHONE_26_0=160000 "$ROOT/ios/LiquidGlassViewComponentView.mm"; then echo "✔"; else fail=1; fi
[ $fail = 0 ] && echo "✔ iOS sources type-check" || { echo "✖ iOS type-check failed"; exit 1; }
