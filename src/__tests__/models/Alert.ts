import Alert from '../../models/Alert';

test('initializes an ALert object', () => {
    const alert = new Alert(1, '');
    expect(alert).toBeTruthy();
});