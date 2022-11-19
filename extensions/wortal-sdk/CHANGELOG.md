# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.9] - 2022-09-07
### Fixed
- adShowing flag not reset when ad not filled

## [1.0.8] - 2022-09-01
### Added
- Support for Cocos Store installation or local

## [1.0.7] - 2022-09-01
### Fixed
- Incorrect extension path when downloading from Cocos Store

## [1.0.6] - 2022-08-31
### Added
- Demo scene and script

### Fixed
- Multiple ad calls can no longer be made simultaneously

### Changed
- Removed extension panel
- Improved readme

## [1.0.5] - 2022-08-26
### Changed
- Extension now overwrites existing wortal assets when loaded. This allows for upgrading in place.
- 3.3 versioned template is now 3.0 to reflect compatibility change

## [1.0.4] - 2022-08-25
### Fixed
- Issue preventing panel from being displayed in Cocos 3.0-3.2

### Changed
- Simplified panel

## [1.0.3] - 2022-08-25
### Added
- Support for Cocos Creator 3.6

### Changed
- Build templates are now versioned
- Wortal bridge scripts are separated from the build templates

## [1.0.2] - 2022-08-19
### Changed
- Improved documentation
- Version compatibility is now 3.3

## [1.0.1] - 2022-08-18
### Fixed
- Possible duplicate init call

### Changed
- Wortal.requestRewarded was changed to Wortal.showRewarded for consistency across the API
- GetPlatform and GetLinkAdUnitIds were changed to getPlatform and getLinkAdUnitIds to follow style convention

## [1.0.0] - 2022-08-17
- Initial release