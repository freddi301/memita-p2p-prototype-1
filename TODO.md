- view pending messages with attachments
- fix conversation scrolling with long messages
- use libsodium to create accounts
- encrypt / decrypt messages
- refactor hyperswarm sincronisation
- better persistance
- search
- audio message
- export (messages, account, contact)
- drafts
- i18n
- validation for user created structures
- validation for received structures
- confirm screen for important deletions (account) (type in name to confirm)
- instructions for key conservation
- export account to password encrypted file
- import account
- share account
- profile frontend
- display attachemnt loading
- conversation detail
  - add contact details
  - add total messages
  - add total attachements

# After merkle refactor
- pin/archive conversations
- star message
- file share
  - image viewer
  - audio viewer
  - video viewer
- memory usage managment
- backup
- selective replication (what to sen to who)
- profile backend


# Complex UI
- on selection (mobile touch hold) (pc right click) contextual menu (deletion ecc)
  - conversation
  - account
  - contact
- animation for page transitions
- animation for emoji picker

# Build
- windows
  - let choose user folder
  - hide native app bar
- linux
- android

# After streaming implementation
- voice call
- video call
- screen sharing

# Optimizations
- deduplicate subsciptions to backend
- restablish on connections lost to backend
- create previews of large files

# Cryptography
- imlement forward secrecy

# Privacy settings
- manage what to share and what not
