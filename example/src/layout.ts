import { Platform, StatusBar } from 'react-native';

/**
 * The tab selector floats over every screen, below the status bar / Dynamic Island.
 * The example has no safe-area dependency, so iOS uses the notch-phone inset.
 */
const STATUS_INSET = Platform.OS === 'ios' ? 59 : (StatusBar.currentHeight ?? 0);
const TAB_BAR_HEIGHT = 36; // LiquidGlassButton size="small"

export const TAB_BAR_TOP = STATUS_INSET + 8;
/** First free position below the tab selector. */
export const CONTENT_TOP = TAB_BAR_TOP + TAB_BAR_HEIGHT + 12;
