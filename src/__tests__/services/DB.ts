import DB, { Key } from '../../services/DB';
import Alert from '../../models/Alert';

test('save an item to the database', () => {
    DB.save(Key.ALERTS, [new Alert(1, '')]);
    expect(DB.fetch(Key.ALERTS)).toBeTruthy();
});

test('save an item to the database', () => {
    DB.delete(Key.ALERTS).then(() => {
        DB.fetch(Key.ALERTS).then(data => expect(data).toBeFalsy());
    });
});