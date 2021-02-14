import { EmojiGroup } from "./EmojiGroup";
import { outboxTray, inboxTray, packageBox, eMail, incomingEnvelope, envelopeWithArrow, closedMailboxWithLoweredFlag, closedMailboxWithRaisedFlag, openMailboxWithRaisedFlag, openMailboxWithLoweredFlag, postbox, postalHorn } from "./emojis";


export const mail = new EmojiGroup(
    "Mail", "Mail",
    outboxTray,
    inboxTray,
    packageBox,
    eMail,
    incomingEnvelope,
    envelopeWithArrow,
    closedMailboxWithLoweredFlag,
    closedMailboxWithRaisedFlag,
    openMailboxWithRaisedFlag,
    openMailboxWithLoweredFlag,
    postbox,
    postalHorn);
