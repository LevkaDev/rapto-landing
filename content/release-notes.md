# Release Notes

## Version 5.68

### New
- 

### Improvements
- 

### Fixes
- 

---

## Version 5.67

### Improvements
- The current desktop in the desktop bar is outlined in the color you chose for the active window border.

### Fixes
- An app that updates or opens while your Mac is locked goes into its slot once you unlock.
- A new document opened from an app's Open window goes into its slot right away.
- Safari's Settings window and other windows that can't be resized no longer go into slots.
- Dragging a tab out of Firefox no longer squeezes your slots.
- A window that opens while its app is still starting goes into its slot instead of staying where it appeared.

---

## Version 5.66

### New
- You can hide standard layouts you don't use: point at one in the layout picker and click Hide. Hidden layouts wait at the end of the picker, where Unhide brings them back.

### Improvements
- You can go back and resize a zone while drawing a layout.

### Fixes
- Layouts follow a change of screen resolution: windows in Manual and Drag to Snap move to their places on the new size by themselves.

---

## Version 5.65

### Improvements
- Rapto stays light and quick, even when another app hangs.
- Changing one shortcut no longer resets your other shortcuts.
- You can now turn off any shortcut you don't need.
- Windows keep their order in slots after a restart.
- General stability improvements and fixes.

### Fixes
- Group/Ungroup Windows works again, and a second press puts windows back where they were. In the Vim Style preset it is now Option-Shift-G.
- Focus mode settings are remembered after a restart.
- Shortcuts stay off in apps where you turned them off.
- Windows shown on all desktops, like Finder, fit their slot on every desktop.
- The group indicator no longer disappears after switching desktops.
- Browser tabs titled Settings or About are arranged like other windows.
- Desktop numbers match Mission Control with several displays.
- System Settings stays out of the layout in any language.
- Claude and similar apps can be moved to another desktop from the desktop bar. For apps shown on all desktops, Rapto explains how to change that.

---

## Version 5.64

### New
- Groups in Drag to Snap: drop a window into a zone where another window already is, and they become a group with an indicator, just like in Manual mode. Resize one window of the group and the others follow.
- Drag to Snap has its own layout on each desktop. Choose a layout, and a dragged window snaps into the zone under the pointer, as in Manual mode. Without a layout, the usual halves, quarters and thirds are used.
- In Drag to Snap, hold ⌥ while dragging to move a window freely without snapping.

### Improvements
- Switching a desktop from Auto-tiling back to Manual brings back your windows exactly as you arranged them. Windows you opened in the meantime join the slot they are in.
- In Manual mode each layout remembers how you arranged your windows: switch to another layout and back, and everything is where you left it.
- Resizing a window in Manual mode resizes all the windows next to it as you drag, keeps the spacing between windows, including the spacing drawn in your own layouts, and stops where a window can't get any smaller.

---

## Version 5.63

### Improvements
- A window in focus mode stays in place: dragging it no longer moves it into another slot or resizes its neighbours.
- Focus mode works on each display and each desktop on its own: you can have a window in focus on every display.

### Fixes
- Group indicators come back after you close a floating window or a window in focus mode.
- Group indicators come back when you float a window in focus mode and then return it to its slot.
- A floating window or a window in focus mode that you minimize or put in full screen goes back to its slot when it returns, and group indicators show up right away.
- A window can no longer be floating and in focus mode at the same time.
- A floating window opened by double-click goes back exactly to its place.
- Double-clicking a video player with the floating or focus key no longer sends the video to full screen.

---

## Version 5.62

### Improvements
- The welcome tour has been reworked and improved.

### Fixes
- Moving a Vivaldi window to another desktop from the desktops bar now works.

---

## Version 5.61

### New
- Apps in full screen now show up in the desktops bar next to your desktops. Click one to go to it.

### Improvements
- The window list shows windows in full screen too, marked "Full Screen".

### Fixes
- Clicking a desktop in the desktops bar takes you to the right desktop when an app is in full screen, and works from a full screen app too.

---

## Version 5.60

### New
- Rapto is ready for Raycast: the Rapto extension is coming to the Raycast Store soon. With it you can switch to any window on any desktop, apply a layout, change the mode or open a workspace right from Raycast.

### Improvements
- A workspace opens on an empty desktop if you have one, instead of adding a new desktop. You can still choose to open it in a new desktop.

### Fixes
- When you open a workspace in a new desktop, its apps no longer get left behind on the old one.

---

## Version 5.59

### New
- Drag to Snap: hold ⌥ while dragging a window to see the zones of your layout and drop the window into any of them. Choose the layout for each desktop in the desktops bar menu.
- Drag to Snap: drag a window to the bottom edge to put it in the left, center or right third of the screen.
- Drag to Snap: drag a snapped window away and it gets back its previous size.

### Improvements
- Drag to Snap: the preview shows up right away when you bring a window to the edge, and no longer pops up while you just move a window around.
- Drag to Snap: the preview grows out of the window and moves smoothly between zones.

### Fixes
- Drag to Snap now works when you drag a window that isn't active.
- Resizing a window by its edge no longer snaps it to half of the screen.
- Windows snap into place right away, without jumping or stopping short.

---

## Version 5.58

### Fixes
- Windows no longer get mixed up between slots when you open an app that is on another desktop, for example from the Dock or with ⌘Tab.
- A new window of an app that already has a slot now opens in that slot, instead of jumping into another one.
---

## Version 5.57

### Fixes
- After restarting your Mac, your desktops keep their mode and layout.
- You can now drag Zen windows to another desktop in the desktops bar.
- App icons in the desktops bar, like Arc's, no longer turn into a dark square.

---

## Version 5.56

### Fixes
- Switching to another user on your Mac and back no longer mixes up your windows. Rapto now waits until you return and keeps every window in its place.
- Restarting Rapto no longer moves windows between slots. Each window stays in the slot where it already is.

---

## Version 5.55

### New
- Workspaces: arrange the apps you use for a task, then right-click the desktop in the desktops bar and choose Workspaces → Save as Workspace…. Open it later on any desktop, or in a new one, and Rapto opens the apps that are closed and puts every window back in its place, on every display. Workspaces can be renamed and deleted from the same menu, or in Settings → Workspaces. If a desktop already has other windows, Rapto asks whether to open the workspace in a new desktop, so two workspaces don't get mixed up. With several displays it asks for each display on its own. Close Workspace closes all of its windows at once, so you can quickly move on to the next one. If a workspace was saved with a display that isn't connected now, Rapto asks whether to open those apps on the display you have or to leave them out.
- What's New in Settings shows what was added, improved and fixed in each version. It opens on its own after Rapto updates.

### Improvements
- When a new version comes out while Rapto is running, you get a notification, and the Rapto menu shows "Install Rapto…". Before, the update window could open hidden behind other windows.
- Rapto no longer installs updates silently. It always asks first, so you see what's new before you update.

### Fixes
- The desktops bar now shows every app on a desktop. Before, it showed only six and hid the rest.

---

## Version 5.54

### New
- Window Switcher: press ⌃⌥W and type the first letters of an app or window name to jump to any open window, on any desktop or display. Use the arrow keys and Return, or ⌘1–⌘9, to pick one. You can change the shortcut in Settings → Shortcuts.

### Fixes
- Recording a shortcut in Settings now works with any key, including F1–F12, keypad keys and Option combinations, and with any keyboard layout.

---

## Version 5.53

### Improvements
- Click an app icon in a group badge to switch straight to that window. Icons stay in place instead of shuffling around.
- Scrolling over a group badge now follows your scroll direction: up switches to the window on the left, down to the one on the right.
- Group badge in the way? Drag it aside to reach the buttons under it. It slides back on its own a couple of seconds after you move the pointer away.
- Further performance improvements.

---

## Version 5.52

### Fixes
- Minor bug fixes and improvements.

---

## Version 5.51

### Fixes
- Closing a desktop in Mission Control no longer shrinks your layout. Group badges stay in the corner of their slot instead of moving to the middle or disappearing.
- The active window border and group badges no longer hang over Mission Control or stay behind in the wrong place after you leave it.

---

## Version 5.50

### Fixes
- A window set to appear on all desktops now shows in the desktops bar only on the desktop you're on, not on every desktop.
- When you minimize a window to the Dock, its border disappears right away instead of lingering for a couple of seconds.
- When you bring a minimized window back, its border shows up again right away, without switching to another window first.

---

## Version 5.49

### New
- 

### Improvements
- Rapto is much lighter on your Mac while you move the mouse, select text or drag windows.

### Fixes
- The active window border now fits snugly around rounded window corners, with no gaps.

---

## Version 5.48

### New
- 

### Improvements
- Getting ready for macOS 27: the + button in the desktops bar and the check marks in the Rapto menu now follow the changes in macOS 27.

### Fixes
- The desktops bar no longer stays on screen over full-screen apps and videos. It now hides with the menu bar and slides down with it when you move the pointer to the top edge.

---

## Version 5.47

### New
- A bar in the menu bar lists your desktops and the apps open on each one. Click a number to switch to that desktop instantly, with no slide, or an app icon to open that app. Turn it off in Settings → General → Menu Bar.
- Right-click a desktop in the bar to set its mode and layout, open the overlay, restore the layout, or open Settings.
- On a MacBook with a notch, the desktops bar stays out of the way: point at the notch and it drops down below it. It also shows for a moment when you switch desktops. Choose Always, On Hover or Automatic in Settings → General → Menu Bar.
- A "+" button at the end of the bar adds a desktop. Drop an app icon on it to move that app's window to a new desktop.
- Drag an app icon in the bar onto another desktop to move that app's window there. You stay on the desktop you were on. Hold Option when you let go to go to that desktop with the window. To make going along the default, turn on "Go With Moved Window" in Settings → General → Menu Bar. Option then keeps you where you are. On a Manual desktop the window snaps into its old slot, or into a free one.

### Improvements
- While the desktops bar is on, the Rapto menu bar icon is hidden, since the bar has the same controls. You can bring the icon back in Settings → General → Menu Bar. It always comes back when the desktops bar is off.

### Fixes
- The desktops bar lists only open windows, not ones minimized to the Dock. Clicking a number switches to that desktop. Clicking an app icon opens that app there. Windows stay on their own desktop.

---

## Version 5.46

### New
- Rapto is now free. No trial, license key, or purchase is required

### Improvements
- 

### Fixes
- 

---

## Version 5.45

### New
- 

### Improvements
- 

### Fixes
- Fixed Restore Layout so it can recover mixed-up Manual layouts and put windows back into the correct slots more reliably

---

## Version 5.44

### New
- 

### Improvements
- 

### Fixes
- Fixed phantom group indicators remaining on slots where no windows exist
- Fixed group indicators incorrectly appearing on adjacent slots or other monitors

---

## Version 5.43

### Fixes
- Fixed new windows not filling empty slots in Manual mode — they opened at their old position instead

---

## Version 5.42

### Fixes
- Fixed group indicator showing closed or non-existent apps in slots where they never were

---

## Version 5.41

### New
- 

### Improvements
- 

### Fixes
- Fixed group indicator staying visible on empty slots when windows were moved to another slot or monitor

---

## Version 5.40

### New
- 

### Improvements
- 

### Fixes
- Fixed Manual layouts getting replaced by the single-window auto layout after switching Desktops

---

## Version 5.39

### New
- 

### Improvements
- 

### Fixes
- Fixed terminal windows with identical titles not tiling correctly in Manual mode

---

## Version 5.38

### New
- 

### Improvements
- 

### Fixes
- Fixed accidental window swaps triggering when you only click or select text

---

## Version 5.37

### New
- 

### Improvements
- 

### Fixes
- Fixed group indicators occasionally staying on screen after switching Spaces

---

## Version 5.35

### New
- Added "Launch at Login" option in General Settings to start Rapto automatically when you log in

### Improvements
- Improved app search in Settings: search field now auto-focuses, supports keyboard navigation (arrow keys), and shows selected result
- Added visual feedback when searching for apps to add to ignored or passthrough lists

### Fixes
- 

---

## Version 5.34

### New
- 

### Improvements
- Improved layout stability after switching Spaces or monitors

### Fixes
- Fixed snap indicator not appearing reliably in Drag-to-Snap mode
- Fixed double-tap floating activation not working correctly on multi-monitor setups
- Fixed layouts becoming unstable after long periods working on a different Space or monitor

---

## Version 5.33

### New
- 

### Improvements
- 

### Fixes
- Fixed layout selection not working in Manual mode after switching from Auto-tiling with no windows

---

## Version 5.31

### New
- New "Follow App to Monitor" setting: when enabled, new windows appear on the same monitor as existing app windows (enabled by default)

### Improvements
- 

### Fixes
- Fixed tiling mode not working when selected on empty screen — new windows are now properly tiled
- Fixed "Follow App to Monitor" placing windows at wrong position on secondary monitors
- Window resize no longer triggers the move-to-slot indicator (only actual window dragging does)
- Fixed duplicate Focus Mode hotkey registration causing "ghost" shortcut that couldn't be changed
- Fixed rare issue where windows from different apps could be incorrectly grouped together
- Fixed source monitor not re-tiling after moving a window to another monitor
- Fixed confusing "Focus Window" label in settings — now correctly shows "Toggle Focus Mode"
- Fixed critical bug where holding Ctrl during window swap could accidentally trigger floating mode

---

## Version 5.30

### Fixes
- Windows that appear while you're on another desktop are now properly detected and assigned to empty slots when you return
- Fixed issue where the same window could appear in multiple slot indicators after switching Spaces

---

## Version 5.29

### Improvements
- All keyboard shortcuts from both presets (Rapto and Vim Style) now register correctly
- Added Focus Slots 1-9 shortcuts to quickly focus windows in specific grid positions
- Added Restore Layout shortcut to settings for customization
- All shortcuts can now be customized in Settings to avoid conflicts with other apps

### Fixes
- Fixed duplicate Focus Mode entry in hotkey settings
- Fixed Vim Style preset shortcuts not using HJKL keys as expected

---

## Version 5.28

### Fixes
- Fixed windows being accidentally moved when drawing custom focus zones in the overlay

---

## Version 5.27

### Improvements
- Auto-tiling now preserves your custom window sizes when switching between Spaces
- Manually resized windows stay at their adjusted size until you add or remove windows

### Fixes
- Fixed "Snap Back" toggle in Manual mode not being respected in some scenarios
- Snap Back is now automatically enabled and hidden in settings when using multiple monitors (required for cross-screen window detection)

---

## Version 5.26

### New
- 

### Improvements
- 

### Fixes
- 

---

## Version 5.25

### Fixes
- Fixed Auto-tiling not working with Terminal.app and iTerm2 in release builds
- Fixed windows not positioning correctly when multiple windows of the same app have identical titles
- Improved window matching reliability for terminal applications

---

## Version 5.20

### Fixes
- Fixed window highlight not updating when switching between windows of the same application
- Fixed group indicators sometimes showing closed windows in Auto-tiling mode
- Fixed snap-back potentially positioning windows to wrong slots after rapid window changes
- Fixed window resize instability with multiple windows from same app (e.g., iTerm2) in Auto-tiling mode

### Improvements
- Stability improvements

---

## Version 5.19

### Fixes
- Fixed Auto-tiling mode instability — windows no longer jump back unexpectedly after swaps
- Fixed keyboard swap not working in Auto-tiling mode
- Improved window position tracking — prevents repeated snap-back attempts

---

## Version 5.18

### New
- **Group/Ungroup hotkey (Ctrl+Shift+G)** — manually group or ungroup windows of the same app
- **Move window hotkey (Opt+Shift+Arrows)** — move window to adjacent slot without swapping
- **Drag to move window** — drag window to another slot with Shift held (or without, if configured)
- Toggle Group Indicators hotkey (Ctrl+Opt+I) — hide/show group badges when they obstruct UI
- Group indicator position setting — choose left or right corner in Settings

### Improvements
- **Smart window distribution** — windows are now distributed evenly across slots regardless of app
- **Manual mode improved** — windows of the same app no longer auto-group (easier multi-Finder workflows)
- Two Finder/Terminal windows now appear side by side (easier for copy/paste workflows)
- Drag to Snap: larger activation zones at screen edges — easier to snap windows
- Added bottom half snap zone when dragging windows to the bottom edge
- Redesigned custom layout creator — modern look with animations, gradients, and visual feedback

### Fixes
- Fixed Auto-tiling not distributing windows when opening multiple windows of the same app
- Fixed Auto-tiling not resizing windows properly when closing them — remaining windows now redistribute evenly
- Fixed group indicator showing total window count instead of windows in that specific slot
- Fixed window positioning failures during redistribution after closing windows
- Fixed last remaining window going to side panel instead of center when closing other windows
- Fixed windows disappearing from management after connecting/disconnecting monitors
- Improved stability when displays are rapidly connected or disconnected
- Fixed swapping window from a group moving the entire group instead of just that window
- Fixed windows staying misaligned after being dragged and returned to their slot
- Fixed group indicator not updating after window redistribution (still showed old count)
- Fixed drag-to-move sometimes failing to resize window after moving it to another slot
- Fixed dragging one window from a group incorrectly moving the entire group
- Fixed windows not resizing after snap-back or swap operations
- Fixed drag-and-drop of windows failing when window titles are empty (common in Cursor/Electron apps)
- Fixed inability to drag windows to empty slots — now you can move windows to any unoccupied slot
- Fixed drag swap not working between windows of the same app (e.g., two Cursor windows)
- Fixed keyboard swap (Ctrl+Arrows) not working correctly with multiple windows of the same app
- Fixed window highlight sometimes jumping to wrong window when switching between windows of the same app
- Fixed keyboard swap requiring double-press to work between windows of the same app
- Fixed windows sometimes appearing in multiple slots after rapid swaps (layout corruption)

---

## Version 5.12

### Fixes
- Minor bug fixes

---

## Version 5.11.2

### Fixes
- Fixed Screen Recording permission prompt reappearing after user declined
- Window previews now correctly show app icons without Screen Recording permission

---

## Version 5.11.1

### Improvements
- Improved diagnostic logging for debugging window preview issues

---

## Version 5.11

### Improvements
- Improved first launch experience
- System permission dialogs now display correctly

### Fixes
- Windows now always appear when selecting a layout
- Fixed permission prompts reappearing

---

## Version 5.8

### Fixes
- Fixed Auto-tiling with some applications (Xcode, VS Code)

---

## Version 5.7

### Improvements
- Improved stability with multiple monitors

---
