import Box, { BoxType } from '../../models/Box';

test('initializes a Box object', () => {
    const box = new Box(1, 'Headlines', BoxType.HEADLINES);
    expect(box).toBeTruthy();
    expect(box.menuVisible).toBe(false);
});

test('returns the type of a box', () => {
    expect(Box.getBoxType('history')).toBe(BoxType.ORDER_HISTORY);
    expect(Box.getBoxType('activity')).toBe(BoxType.RECENT_ACTIVITY);
    expect(Box.getBoxType('headlines')).toBe(BoxType.HEADLINES);
    expect(Box.getBoxType('alerts')).toBe(BoxType.ALERTS);
    expect(Box.getBoxType('')).toBe(BoxType.ORDER_HISTORY);
});

test('returns a box title', () => {
    expect(Box.getTitle(BoxType.ORDER_HISTORY)).toBe(BoxType.ORDER_HISTORY);
    expect(Box.getTitle(BoxType.RECENT_ACTIVITY)).toBe(BoxType.RECENT_ACTIVITY);
    expect(Box.getTitle(BoxType.HEADLINES)).toBe(BoxType.HEADLINES);
    expect(Box.getTitle(BoxType.ALERTS)).toBe(BoxType.ALERTS);
});