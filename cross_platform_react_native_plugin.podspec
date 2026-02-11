require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "cross_platform_react_native_plugin"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platform     = :ios, "14.0"
  s.source       = { :git => "https://github.com/Ishika1601-boxpay/react_native_module.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.vendored_frameworks = 'ios/Framework/CrossPlatformSDK.xcframework'
  s.private_header_files = "ios/**/*.h"
  s.dependency "React-Core"

  s.requires_arc = true
end
