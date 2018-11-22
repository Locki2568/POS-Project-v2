const prinReceipt = require('../printReceipt.js');

const input = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000002-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
  ]

it('should print receipt like this', ()=>{
    expect(prinReceipt(input)).toBe('***<store earning no money>Receipt ***\n'+
    'Name: Sprite, Quantity: 6 bottles, Unit price: 3.00 (yuan), Subtotal: 9.00 (yuan)\n'+
    'Name: Apple, Quantity: 2 kg, Unit price: 5.50 (yuan), Subtotal: 11.00 (yuan)\n'+
    'Name: Noodles, Quantity: 3 bags, Unit price: 4.50 (yuan), Subtotal: 9.00 (yuan)\n'+
    '----------------------\n'+
    'Total: 29.00 (yuan)\n'+
    'Saving: 13.50 (yuan)\n'+
    '**********************');
});