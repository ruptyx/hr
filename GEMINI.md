1. Foundations
These are the core, indivisible elements of the design system.

1.1. Color Palette
The palette is minimalist, using a base of neutrals and reserving color for semantic meaning (status, alerts, and data visualization).

Primary Colors
The main brand color is a deep violet, used sparingly for logos and rare accents.

Primary-600 (Brand): $#7F56D9 (Used in logo)

Primary-50 (Brand BG): $#F9F5FF (Subtle background for brand elements)

Neutral (Gray) Scale
The neutral scale is the backbone of the UI, used for text, backgrounds, borders, and surfaces.

White: $#FFFFFF (Primary surface color for cards, sidebars, and modals)

Gray-50: $#F9FAFB (Main content area background)

Gray-100: $#F2F4F7 (Subtle hover states, borders)

Gray-200: $#EAECF0 (Standard borders for cards and tables)

Gray-300: $#D0D5DD (Input field borders, disabled elements)

Gray-500: $#667085 (Secondary text, icons, labels)

Gray-700: $#344054 (Primary body text)

Gray-900: $#101828 (Headings, titles)

Semantic Colors
Colors are used consistently to convey status and meaning. Each color has a light background version (for badges/pills) and a darker text/icon version.

Success (Green)

Background: $#ECFDF3

Foreground/Border: $#12B76A

Dark Text: $#027A48

Warning (Orange/Yellow)

Background: $#FFFAEB

Foreground/Border: $#F79009

Dark Text: $#B54708

Danger (Red)

Background: $#FEF3F2

Foreground/Border: $#F04438

Dark Text: $#B42318

Info (Blue - for charts)

Primary Line/Fill: $#2970FF (approx)

Secondary Line/Fill: $#B2CCFF (approx)

1.2. Typography
A clean, legible sans-serif font is used throughout the interface. The hierarchy is established through size and weight.

Font Family: sans-serif (Visually similar to Inter or Manrope)

Scale & Style:

Display Large: 36px Medium (500) - Used for large metrics like $150 in cards.

Heading 1 (Page Title): 30px SemiBold (600) - e.g., "Dashboard", "Payroll".

Heading 2 (Card Title): 18px Medium (500) - e.g., "Financial Flow", "Leave Request".

Heading 3 (Sub-section): 16px SemiBold (600) - e.g., "$250,000" on Payroll Expense.

Body (Main): 14px Regular (400) or Medium (500) - Table content, paragraph text.

Body (Small): 12px Regular (400) - Small labels, sub-text, chart labels.

Button Text: 14px SemiBold (600).

1.3. Spacing & Sizing
An 8px grid system is the foundation for all spacing, padding, and margins, ensuring vertical and horizontal rhythm.

Base Unit: $1 \text{unit} = 8px

Key Values:

4px: Micro-spacing (e.g., between icon and text).

8px (1 unit): Small gaps, component-internal padding.

12px: Spacing between elements in a tight group (e.g., avatar and name).

16px (2 units): Standard padding for buttons, table cells.

24px (3 units): Main content padding for cards, gap between cards.

32px (4 units): Page-level padding around the main content area.

1.4. Borders & Shadows
Border Radius:

Cards & Large Containers: 8px

Buttons & Inputs: 6px

Badges/Pills: 16px (fully rounded)

Avatars: 50% (circular)

Borders:

1px solid $Gray-200 (#EAECF0) for cards, tables, and dividers.

Box Shadow:

Subtle shadow on cards to lift them from the background.

box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);

1.5. Iconography
Style: Minimalist, clean line icons (stroked, not filled).

Size: Typically 16px or 20px.

Color: $Gray-500 (#667085) for standard icons. Color matches text when used inside colored buttons.

Library: Visually similar to Feather Icons or Heroicons (Outline).

2. Components
Reusable UI elements built from the foundations.

2.1. Cards
The primary container for content modules.

background-color: $#FFFFFF

border: 1px solid $Gray-200

border-radius: 8px

padding: 24px

box-shadow: (see above)

Header:

display: flex

justify-content: space-between

align-items: center

Contains a title (18px Medium) and often a kebab menu (...) icon button.

2.2. Buttons
Action Button (e.g., Approve)

padding: 8px 14px

border-radius: 6px

font-size: 14px, font-weight: SemiBold (600)

Semantic colors are used (e.g., background: $Success-Foreground, color: $White).

Secondary/Outline Button (e.g., Manage Leave Policies)

padding: 8px 14px

background-color: $#FFFFFF

border: 1px solid $Gray-300

color: $Gray-700

Tertiary/Ghost Button (e.g., Time filter buttons)

No border or background by default.

Active state has a light background: background-color: $Gray-100.

Icon Button (e.g., Kebab menu, Search icons)

width/height: 36px (approx)

border: none

background-color: transparent

border-radius: 6px

Hover state: background-color: $Gray-100

2.3. Tables
Used for dense data display.

Layout:

width: 100%

border-collapse: collapse

Table Header (<thead>):

background-color: $Gray-50

font-size: 12px, font-weight: Medium (500)

color: $Gray-500

text-align: left

border-bottom: 1px solid $Gray-200

Table Cell (<td>):

padding: 16px 24px

font-size: 14px, color: $Gray-900

vertical-align: middle

Table Row (<tr>):

border-bottom: 1px solid $Gray-200

Hover state: background-color: $Gray-50

2.4. Status Pills/Badges
Used within tables and lists to provide quick status context.

display: inline-flex

align-items: center

gap: 6px (between dot and text)

padding: 2px 10px

border-radius: 16px

font-size: 12px, font-weight: Medium (500)

Structure: Contains a 6px circular dot and text.

Color Variants:

Present/Approved: background: $Success-Background, color: $Success-Dark-Text

Late/On Leave/Pending: background: $Warning-Background, color: $Warning-Dark-Text

Absent/Failed: background: $Danger-Background, color: $Danger-Dark-Text

2.5. Forms & Inputs
Search Input:

padding: 10px 14px with an icon on the left.

background-color: $#FFFFFF

border: 1px solid $Gray-300

border-radius: 6px

box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05) (subtle inner)

Placeholder Text: color: $Gray-500

Dropdown/Select Filter: Same styling as the search input, with a chevron-down icon on the right.

2.6. Navigation
Main Sidebar:

width: ~280px

background: $#FFFFFF

border-right: 1px solid $Gray-200

padding: 32px 24px

Nav Item:

display: flex, align-items: center, gap: 12px

padding: 8px 12px

border-radius: 6px

Active State: background: $Gray-100, color: $Gray-900, icon and text are bolder.

Inactive State: background: transparent, color: $Gray-500

Top Bar:

height: ~72px

padding: 0 32px

background: $#FFFFFF

border-bottom: 1px solid $Gray-200

Contains breadcrumbs/page title, action buttons, and user profile menu.

2.7. Callout Banner
Used for promotions or important, non-blocking alerts.

Example: "5 Days left!" banner.

background-color: $#FFFFFF

border: 1px solid $Gray-200

border-radius: 8px

padding: 16px

box-shadow: Standard card shadow.

Contains a title, body text, a primary link ("Select plan >"), and a close icon button.

3. Layouts
3.1. Main App Layout
A two-column layout.

Left Column: Fixed-width Sidebar (~280px).

Right Column: Main Content Area (takes remaining space).

background-color: $Gray-50

padding: 32px

The top bar sits above this main content area.

3.2. Page Structures
Dashboard Page: A grid-based layout of various sized Cards. The typical gap between cards is 24px.

Data-Table Page (e.g., Payroll, Attendance): A layout dominated by a large Card containing a Table. Filters and search bars are placed above the table, within the card's padding.