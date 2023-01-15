import { writeFileSync } from 'fs'
import { join as joinPath } from 'path'
import type { PackageJson } from 'type-fest'
import type { ProjectOptions } from './wizard'

type OptionalSemVerPart = bigint | 'x'
type OptionalSpace = '' | ' '
type SemVerNumber =
  | `${bigint}`
  | `${bigint}.${OptionalSemVerPart}`
  | `${bigint}.${OptionalSemVerPart}.${OptionalSemVerPart}`
type VersionRangeIndicator = '~' | '>' | '>=' | '^'
type EngineVersionNumber =
  | `${SemVerNumber}`
  | `${VersionRangeIndicator}${SemVerNumber}`
  | '*'
type EngineVersion =
  | EngineVersionNumber
  | `${EngineVersionNumber}${OptionalSpace}<${OptionalSpace}${SemVerNumber}`

type PackageOptions = ProjectOptions & {
  requiredNodeVersion?: EngineVersion
}

export const getPackageContent = ({
  projectName,
}: PackageOptions): PackageJson => ({
  name: projectName,
  version: '0.0.1',
  description: 'TBC',
  main: 'src/index.ts',
  author: 'TBC',
  license: 'TBC',
})

export const writePackage = (
  processDirectory: string,
  options: ProjectOptions,
): void => {
  // TODO Consolidate duplicated logic with make-boilerplate
  const dir =
    processDirectory !== options.projectName
      ? joinPath('.', options.projectName)
      : processDirectory

  writeFileSync(
    joinPath(dir, 'package.json'),
    JSON.stringify(getPackageContent(options), null, 2),
  )
}
