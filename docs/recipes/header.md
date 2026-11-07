# Glass header

A floating glass header over a scrolling feed, with a small glass button inside.

<Preview id="recipe-header" />

## Code

<<< @/../examples/shared/scenes/RecipeHeader.tsx

## How it works

- The feed scrolls **inside** the backdrop. Its `paddingTop` keeps the first post clear of the header until you scroll.
- The header floats **outside** the backdrop, on top, with `position: 'absolute'`.
- `cornerRadius={HEADER_HEIGHT / 2}` makes it a pill.
- The button inside the header is glass too. It sets `textStyle` to white, because the default button label is dark in light mode.

## In a real app

Use the safe-area inset instead of a fixed top:

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
const TOP = insets.top + 8;
```

## Variations

- **Thicker header for long titles:** `material="thick"` keeps text readable over busy photos.
- **Rounded rectangle instead of a pill:** set `cornerRadius={20}`.
