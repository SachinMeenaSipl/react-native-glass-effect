require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-liquid-glass"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/SachinMeenaSipl/react-native-glass-effect"
  s.license      = package["license"]
  s.authors      = { "Sachin Meena" => "sachin.meena3198@gmail.com" }
  s.platforms    = { :ios => "15.1" }
  s.source       = { :git => "https://github.com/SachinMeenaSipl/react-native-glass-effect.git", :tag => "v#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.frameworks   = "UIKit", "QuartzCore"

  # Adds React-Core, codegen (RNLiquidGlassSpec) and Fabric dependencies.
  install_modules_dependencies(s)
end
