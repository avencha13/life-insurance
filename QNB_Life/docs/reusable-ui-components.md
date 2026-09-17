# QNB Life React — Reusable UI Components

Catalog of shared widgets in `QNB_Life/src/components/ui` (and related layout helpers).  
Flutter source of truth: `qnb-insurance-ui-component` (`ui_components`).

**Phases**

- Phase 1: `UIDataTable` (+ StatusChip, FilterDropdown, HoverActionIcon, controller)
- Phase 2: CRUD shell — `UIRightPanel`, `UIDialog`, toast, `UIAddButton`, `UISummaryStatusRow`, input polish; City wired as reference

Deferred: PDF/Excel, charts, calendar, OTP, full nav drawer kit.

Import from the barrel:

```js
import {
  UIText,
  UIButton,
  UIInput,
  UIDropdown,
  UIDataTable,
  UIRightPanel,
  UIDialog,
  UIAddButton,
  UISummaryStatusRow,
  useToast,
  RowActionType,
  rowAction,
} from '@/components/ui'
```

Wrap the app with `ToastProvider` (already in [`AppProviders`](../src/app/providers.jsx)).

---

## Typography

### UIText

| | |
|--|--|
| **Path** | `src/components/ui/UIText/UIText.jsx` |
| **Flutter** | `UiTextNew` |
| **Purpose** | Typed text variants (headings + body) |
| **Props** | `as`, `variant`, `color`, `className`, `children` |
| **Usage** | Page titles, labels, empty states |

---

## Actions

### UIButton

| | |
|--|--|
| **Path** | `src/components/ui/UIButton/UIButton.jsx` |
| **Flutter** | `UIButton` / `UIButtonPrimary` / `UIOutlineButton` |
| **Purpose** | Primary / outline / ghost / danger buttons |
| **Props** | `variant` (`primary` \| `outline` \| `ghost` \| `danger` \| `icon`), `type`, `disabled`, `children` |

### UIAddButton

| | |
|--|--|
| **Path** | `src/components/ui/UIAddButton/UIAddButton.jsx` |
| **Flutter** | `UIAddButton` |
| **Purpose** | Primary CTA with leading `+` for list pages |
| **Props** | `label`, `onClick`, `disabled` |
| **City** | Header “Add City” |

---

## Inputs

### UIInput

| | |
|--|--|
| **Path** | `src/components/ui/UIInput/UIInput.jsx` |
| **Flutter** | `UIInputField.primary` |
| **Purpose** | Labeled text field with error / readOnly / disabled |
| **Props** | `label`, `error`, `readOnly`, `disabled`, `leftAdornment`, `rightAdornment`, native input props |
| **City** | City code / name / country on form |

### UIDropdown

| | |
|--|--|
| **Path** | `src/components/ui/UIDropdown/UIDropdown.jsx` |
| **Flutter** | `UIDropdownMenu` |
| **Purpose** | Labeled select with error / locked (disabled or readOnly) |
| **Props** | `label`, `value`, `onChange`, `options[{value,label}]`, `placeholder`, `disabled`, `readOnly`, `error` |
| **City** | Status Active / Inactive |

### UISwitch

| | |
|--|--|
| **Path** | `src/components/ui/UISwitch/UISwitch.jsx` |
| **Flutter** | `UISwitch` / Material `Switch.adaptive` |
| **Purpose** | Boolean toggle |
| **Props** | `checked`, `onChange`, `label`, `disabled` |
| **Note** | Available for masters; City status uses `UIDropdown` |

### UICheckBox

| | |
|--|--|
| **Path** | `src/components/ui/UICheckBox/UICheckBox.jsx` |
| **Flutter** | `UICheckBox` |
| **Purpose** | Checkbox (also used by table multi-select) |
| **Props** | `checked`, `onChange(boolean)`, `label`, `disabled` |

---

## Feedback

### UIDialog

| | |
|--|--|
| **Path** | `src/components/ui/UIDialog/UIDialog.jsx` |
| **Flutter** | `UiDialogBoxNew` |
| **Purpose** | Modal confirm (delete, etc.) |
| **Props** | `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `tone` (`primary` \| `danger`), `onConfirm`, `onCancel` |
| **City** | Delete confirmation |

### ToastProvider / useToast

| | |
|--|--|
| **Path** | `src/components/ui/UIToast/ToastProvider.jsx` |
| **Flutter** | `ToastNotificationUtils` |
| **Purpose** | Success / error toasts |
| **API** | `toast.success(msg)`, `toast.error(msg)`, `toast.push(msg, tone)` |
| **City** | After save / delete |

### UILoader

| | |
|--|--|
| **Path** | `src/components/ui/UILoader/UILoader.jsx` |
| **Flutter** | `AppPageProgressIndicator` / `UiLoader` |
| **Purpose** | Inline loading label |
| **Props** | `label` |

---

## Data display

### UIDataTable

| | |
|--|--|
| **Path** | `src/components/ui/UIDataTable/UIDataTable.jsx` |
| **Flutter** | `DataTableWidget` + `DataTableController` |
| **Purpose** | Search, sort, column filters, pagination (top+bottom), row actions, multi-select, server-side hooks |
| **Key props** | `columns`, `rows`/`data`, `title`, `showSearchBox`, `rowActions`, `onView`/`onModify`/`onDelete`, `filterableColumns`, `pageSize`, `controller`, `emptyLabel`, `multiSelect`, server pagination props |
| **Helpers** | `StatusChip`, `useDataTableController`, `RowActionType`, `rowAction` |
| **Usage** | City list; Dashboard Transaction Analysis |

### StatusChip

| | |
|--|--|
| **Path** | `src/components/ui/UIDataTable/StatusChip.jsx` |
| **Flutter** | `buildStatusChip` |
| **Purpose** | Colored Active / Inactive (and common status) pill |
| **Props** | `status`, `label` |

### UISummaryStatusRow

| | |
|--|--|
| **Path** | `src/components/ui/UISummaryStatusRow/UISummaryStatusRow.jsx` |
| **Flutter** | `SummaryStatusRow` |
| **Purpose** | All / Active / Inactive filter chips with counts |
| **Props** | `items[{key,label,count}]`, `value`, `onChange` |
| **City** | Above city table |

### UICard

| | |
|--|--|
| **Path** | `src/components/ui/UICard/UICard.jsx` |
| **Flutter** | `UICard` |
| **Purpose** | Surface container |
| **Props** | `as`, `children`, `className` |

### UISvgIcon

| | |
|--|--|
| **Path** | `src/components/ui/UISvgIcon/UISvgIcon.jsx` |
| **Flutter** | `UISvgIcon` |
| **Purpose** | SVG image icon |
| **Props** | `src`, `alt`, `size` |

### UISpace

| | |
|--|--|
| **Path** | `src/components/ui/UISpace/UISpace.jsx` |
| **Flutter** | `UISpace` |
| **Purpose** | Spacing primitive |
| **Props** | `size`, `axis` (`x` \| `y`) |

---

## Shell / overlays

### UIRightPanel

| | |
|--|--|
| **Path** | `src/components/ui/UIRightPanel/UIRightPanel.jsx` |
| **Flutter** | `showRightPanel` + `RightSidePanelContent` |
| **Purpose** | Backdrop + slide-in drawer for add / edit / view forms |
| **Props** | `open`, `title`, `onClose`, `children`, `width` (default 420) |
| **City** | Hosts `CityForm` |

---

## Layout helpers (`src/components/layout`)

| Component | Path | Purpose |
|-----------|------|---------|
| Box | `layout/Box/Box.jsx` | Generic div wrapper |
| Form | `layout/Form/Form.jsx` | Form element wrapper |
| Main | `layout/Main/Main.jsx` | Page main landmark |
| Header | `layout/Header/Header.jsx` | Page header |
| Footer | `layout/Footer/Footer.jsx` | Page footer |

---

## City CRUD flow (reference)

1. **List** — `UIDataTable` + `UISummaryStatusRow`
2. **Add** — `UIAddButton` → `UIRightPanel` + `CityForm` (`mode=add`)
3. **View / Edit** — row actions → panel + form (`view` / `edit`)
4. **Delete** — `UIDialog` (`tone=danger`) → SoftFetch remove → toast
5. **Save** — form submit → SoftFetch upsert → toast → close panel

Mirror this pattern for future master screens.

---

## Adding a new widget

1. Create `src/components/ui/UIName/UIName.jsx` + `.css`
2. Export from `src/components/ui/index.js`
3. Document a section in this file (path, Flutter peer, props, usage)
4. Prefer Flutter peer in `qnb-insurance-ui-component` over inventing new APIs
