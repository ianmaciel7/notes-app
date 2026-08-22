import type * as React from "react"

type AppHeaderIconProps = React.SVGProps<SVGSVGElement>

function AppHeaderPhosphorIcon({
  children,
  ...props
}: AppHeaderIconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden="true"
      role="img"
      {...props}
    >
      {children}
    </svg>
  )
}

function AppHeaderCaretLeftIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M168.49 199.51a12 12 0 0 1-17 17l-80-80a12 12 0 0 1 0-17l80-80a12 12 0 0 1 17 17L97 128Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderCaretRightIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="m184.49 136.49l-80 80a12 12 0 0 1-17-17L159 128L87.51 56.49a12 12 0 1 1 17-17l80 80a12 12 0 0 1-.02 17"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderCaretDownIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="m216.49 104.49l-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderPlusIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderCloseIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderPushPinIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="m238.15 78.54l-60.69-60.68a20 20 0 0 0-28.3 0L97.2 70c-12.43-3.33-36.68-5.72-61.74 14.5a20 20 0 0 0-1.6 29.73l45.46 45.47l-39.8 39.8a12 12 0 0 0 17 17l39.8-39.81l45.47 45.46a20 20 0 0 0 14.12 5.85c.46 0 .93 0 1.4-.05a20 20 0 0 0 14.56-7.95c4.69-6.23 11-16.13 14.44-28s3.45-22.88.16-33.4l51.7-51.87a20 20 0 0 0-.02-28.19m-74.26 68.79a12 12 0 0 0-2.23 13.84c3.43 6.86 6.9 21-6.28 40.65L54.08 100.53c21.09-14.59 39.53-6.64 41-6a11.67 11.67 0 0 0 13.81-2.29l54.43-54.61l55 55Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderPushPinFillIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="m235.33 104l-53.47 53.65c4.56 12.67 6.45 33.89-13.19 60A15.93 15.93 0 0 1 157 224c-.38 0-.75 0-1.13 0a16 16 0 0 1-11.32-4.69L96.29 171l-42.63 42.66a8 8 0 0 1-11.32-11.32L85 159.71l-48.3-48.3A16 16 0 0 1 38 87.63c25.42-20.51 49.75-16.48 60.4-13.14L152 20.7a16 16 0 0 1 22.63 0l60.69 60.68A16 16 0 0 1 235.33 104Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderCircleDashedIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M92.38 38.05A12 12 0 0 1 101 23.42a108 108 0 0 1 54 0a12 12 0 1 1-6 23.23a84.1 84.1 0 0 0-42 0a12 12 0 0 1-14.62-8.6M50.94 52.34a108.1 108.1 0 0 0-27 46.76a12 12 0 0 0 8.37 14.77a12.2 12.2 0 0 0 3.2.43a12 12 0 0 0 11.56-8.8a84 84 0 0 1 21-36.35a12 12 0 1 0-17.13-16.81m-3.88 98.14a12 12 0 0 0-23.12 6.42a108 108 0 0 0 27 46.78A12 12 0 0 0 68 186.85a84 84 0 0 1-20.94-36.37M149 209.35a84 84 0 0 1-42 0a12 12 0 1 0-6 23.23a108 108 0 0 0 54 0a12 12 0 1 0-6-23.23m74.72-67.22A12 12 0 0 0 209 150.5a84 84 0 0 1-21 36.35a12 12 0 0 0 17.12 16.82a108.2 108.2 0 0 0 27-46.77a12 12 0 0 0-8.41-14.77Zm-14.77-36.61a12 12 0 0 0 23.12-6.42a108 108 0 0 0-27-46.78A12 12 0 1 0 188 69.15a84 84 0 0 1 20.94 36.37Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderSidebarSimpleIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M216 36H40a20 20 0 0 0-20 20v144a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20M44 60h32v136H44Zm168 136H100V60h112Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderFileIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31L188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48zm-32-80a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderFolderIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M216 72h-85.33l-27.73-20.8A16.08 16.08 0 0 0 93.33 48H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V88a16 16 0 0 0-16-16m0 136H40V64h53.33l27.73 20.8a16.08 16.08 0 0 0 9.61 3.2H216Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderBookOpenIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M232 48v144a8 8 0 0 1-8 8h-56a32 32 0 0 0-32 32a8 8 0 0 1-16 0a32 32 0 0 0-32-32H32a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h56a48 48 0 0 1 40 21.42A48 48 0 0 1 168 40h56a8 8 0 0 1 8 8M88 184a48 48 0 0 1 32 12.18V88a32 32 0 0 0-32-32H40v128Zm128 0V56h-48a32 32 0 0 0-32 32v108.18A48 48 0 0 1 168 184Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderLightbulbIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M176 232a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8m40-128a87.55 87.55 0 0 1-33.64 69.21A16.24 16.24 0 0 0 176 186v6a16 16 0 0 1-16 16H96a16 16 0 0 1-16-16v-6a16 16 0 0 0-6.23-12.66A87.59 87.59 0 0 1 40 104.49C39.74 56.83 78.26 17.14 125.88 16A88 88 0 0 1 216 104m-16 0a72 72 0 0 0-73.74-72c-39 .92-70.47 33.39-70.26 72.39a71.65 71.65 0 0 0 27.64 56.3A32 32 0 0 1 96 186v6h64v-6a32.15 32.15 0 0 1 12.47-25.35A71.65 71.65 0 0 0 200 104m-16.11-9.34a57.6 57.6 0 0 0-46.56-46.55a8 8 0 0 0-2.66 15.78c16.57 2.79 30.63 16.85 33.44 33.45A8 8 0 0 0 176 104a9 9 0 0 0 1.35-.11a8 8 0 0 0 6.54-9.23"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderGraphIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M200 152a31.84 31.84 0 0 0-19.53 6.68l-23.11-18A31.65 31.65 0 0 0 160 128c0-.74 0-1.48-.08-2.21l13.23-4.41A32 32 0 1 0 168 104c0 .74 0 1.48.08 2.21l-13.23 4.41A32 32 0 0 0 128 96a32.6 32.6 0 0 0-5.27.44L115.89 81A32 32 0 1 0 96 88a32.6 32.6 0 0 0 5.27-.44l6.84 15.4a31.92 31.92 0 0 0-8.57 39.64l-25.71 22.84a32.06 32.06 0 1 0 10.63 12l25.71-22.84a31.91 31.91 0 0 0 37.36-1.24l23.11 18A31.65 31.65 0 0 0 168 184a32 32 0 1 0 32-32m0-64a16 16 0 1 1-16 16a16 16 0 0 1 16-16M80 56a16 16 0 1 1 16 16a16 16 0 0 1-16-16M56 208a16 16 0 1 1 16-16a16 16 0 0 1-16 16m56-80a16 16 0 1 1 16 16a16 16 0 0 1-16-16m88 72a16 16 0 1 1 16-16a16 16 0 0 1-16 16"
      />
    </AppHeaderPhosphorIcon>
  )
}

function AppHeaderCompassIcon(props: AppHeaderIconProps) {
  return (
    <AppHeaderPhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m44.42-143.16l-64 32a8.05 8.05 0 0 0-3.58 3.58l-32 64A8 8 0 0 0 80 184a8.1 8.1 0 0 0 3.58-.84l64-32a8.05 8.05 0 0 0 3.58-3.58l32-64a8 8 0 0 0-10.74-10.74M138 138l-40.11 20.11L118 118l40.15-20.07Z"
      />
    </AppHeaderPhosphorIcon>
  )
}

export {
  AppHeaderBookOpenIcon,
  AppHeaderCaretDownIcon,
  AppHeaderCaretLeftIcon,
  AppHeaderCaretRightIcon,
  AppHeaderCircleDashedIcon,
  AppHeaderCloseIcon,
  AppHeaderCompassIcon,
  AppHeaderFileIcon,
  AppHeaderFolderIcon,
  AppHeaderGraphIcon,
  AppHeaderLightbulbIcon,
  AppHeaderPlusIcon,
  AppHeaderPushPinFillIcon,
  AppHeaderPushPinIcon,
  AppHeaderSidebarSimpleIcon,
  type AppHeaderIconProps,
}
