#!/usr/bin/env bash
# Compile the Android Kotlin sources WITHOUT an Android SDK / Gradle, then run JVM logic tests.
#
# Compiles against:
#   - the real android.jar (API 34) → Android API usage is really checked
#   - stubs/ → hand-copied signatures of the React Native 0.81 classes we use
#   - codegen output from src/specs → the real generated module spec
#
# It catches Kotlin syntax/type errors and wrong Android API use. It does NOT replace
# building the example app (the RN stubs are only as accurate as their copy).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$HERE/../.."
CACHE="$HERE/.cache"
mkdir -p "$CACHE"

KOTLIN_VERSION=2.1.20
if [ ! -x "$CACHE/kotlinc/bin/kotlinc" ]; then
  echo "↓ Kotlin $KOTLIN_VERSION"
  curl -fsSL -o "$CACHE/kotlinc.zip" "https://github.com/JetBrains/kotlin/releases/download/v$KOTLIN_VERSION/kotlin-compiler-$KOTLIN_VERSION.zip"
  unzip -q -o "$CACHE/kotlinc.zip" -d "$CACHE"
fi
if [ ! -f "$CACHE/android.jar" ]; then
  echo "↓ android.jar (API 34)"
  curl -fsSL -o "$CACHE/android.jar" "https://raw.githubusercontent.com/Sable/android-platforms/master/android-34/android.jar"
fi

node "$HERE/gen-spec.js"

echo "▶ compiling library"
rm -rf "$CACHE/classes"
"$CACHE/kotlinc/bin/kotlinc" -Werror -jvm-target 17 -cp "$CACHE/android.jar" -d "$CACHE/classes" \
  $(find "$HERE/stubs" -name "*.kt" -o -name "*.java") \
  "$CACHE/codegen/java/com/liquidglass/NativeLiquidGlassModuleSpec.java" \
  $(find "$ROOT/android/src/main/java" -name "*.kt") 2>&1 | grep -v "^Picked up" || true
test -d "$CACHE/classes/com/liquidglass" || { echo "✖ compile failed"; exit 1; }
echo "✔ compiled $(find "$CACHE/classes/com/liquidglass" -name '*.class' | wc -l) classes"

echo "▶ JVM logic tests"
rm -rf "$CACHE/tests"
"$CACHE/kotlinc/bin/kotlinc" -nowarn -cp "$CACHE/classes:$CACHE/android.jar" "$HERE/tests/NativeLogicTest.kt" -d "$CACHE/tests" 2>&1 | grep -v "^Picked up" || true
"$CACHE/kotlinc/bin/kotlin" -cp "$CACHE/tests:$CACHE/classes:$CACHE/android.jar" NativeLogicTestKt 2>&1 | grep -v "^Picked up" | tee "$CACHE/test.log"
grep -q "ALL PASSED" "$CACHE/test.log"
