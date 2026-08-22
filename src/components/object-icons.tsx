import {
  AppSidebarArchiveIcon,
  AppSidebarAtomicNoteIcon,
  AppSidebarAudioIcon,
  AppSidebarBookIcon,
  AppSidebarCodeIcon,
  AppSidebarFileIcon,
  AppSidebarIcon,
  AppSidebarIdeaIcon,
  AppSidebarImageIcon,
  AppSidebarKnowledgeIcon,
  AppSidebarObjectsIcon,
  AppSidebarPageIcon,
  AppSidebarPdfIcon,
  AppSidebarPinIcon,
  AppSidebarProjectIcon,
  AppSidebarQuoteIcon,
  AppSidebarTableIcon,
  AppSidebarTaskIcon,
  AppSidebarTweetIcon,
  AppSidebarWeblinkIcon,
  type AppSidebarIconProps,
} from "@/components/app-sidebar-icons"

type ObjectIconProps = Omit<AppSidebarIconProps, "name">

function ObjectTagIcon(props: ObjectIconProps) {
  return <AppSidebarPinIcon {...props} />
}

function ObjectPlaceIcon(props: ObjectIconProps) {
  return <AppSidebarPinIcon {...props} />
}

function ObjectPersonIcon(props: ObjectIconProps) {
  return <AppSidebarIcon name="knowledge" {...props} />
}

function ObjectMeetingIcon(props: ObjectIconProps) {
  return <AppSidebarIcon name="tweet" {...props} />
}

function ObjectOrganizationIcon(props: ObjectIconProps) {
  return <AppSidebarProjectIcon {...props} />
}

function ObjectMediaIcon(props: ObjectIconProps) {
  return <AppSidebarImageIcon {...props} />
}

function ObjectTravelIcon(props: ObjectIconProps) {
  return <AppSidebarProjectIcon {...props} />
}

function ObjectAiChatIcon(props: ObjectIconProps) {
  return <AppSidebarTweetIcon {...props} />
}

function ObjectDefinitionIcon(props: ObjectIconProps) {
  return <AppSidebarPinIcon {...props} />
}

function ObjectQueryIcon(props: ObjectIconProps) {
  return <AppSidebarIcon name="search" {...props} />
}

export {
  AppSidebarArchiveIcon as ObjectArchiveIcon,
  AppSidebarAtomicNoteIcon as ObjectAtomicNoteIcon,
  AppSidebarAudioIcon as ObjectAudioIcon,
  AppSidebarBookIcon as ObjectBookIcon,
  AppSidebarCodeIcon as ObjectCodeIcon,
  AppSidebarFileIcon as ObjectFileIcon,
  AppSidebarIdeaIcon as ObjectIdeaIcon,
  AppSidebarImageIcon as ObjectImageIcon,
  AppSidebarKnowledgeIcon as ObjectKnowledgeIcon,
  AppSidebarObjectsIcon as ObjectAreaIcon,
  AppSidebarObjectsIcon as ObjectCollectionIcon,
  AppSidebarPageIcon as ObjectPageIcon,
  AppSidebarPdfIcon as ObjectPdfIcon,
  AppSidebarProjectIcon as ObjectProjectIcon,
  AppSidebarQuoteIcon as ObjectQuoteIcon,
  AppSidebarTableIcon as ObjectTableIcon,
  AppSidebarTaskIcon as ObjectTaskIcon,
  AppSidebarTweetIcon as ObjectTweetIcon,
  AppSidebarWeblinkIcon as ObjectWeblinkIcon,
  ObjectAiChatIcon,
  ObjectDefinitionIcon,
  ObjectMediaIcon,
  ObjectMeetingIcon,
  ObjectOrganizationIcon,
  ObjectPersonIcon,
  ObjectPlaceIcon,
  ObjectQueryIcon,
  ObjectTagIcon,
  ObjectTravelIcon,
  type ObjectIconProps,
}
