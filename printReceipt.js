function prinReceipt(barcodeList){
    var boutghItemList = [];
    var distinctItemList= filterDistinctItem(barcodeList)
    var receipt = ''
    receipt += generateHeader()
    console.log("receipt: "+receipt)
    for (let i=0; i<distinctItemList.length; i++){
        var itemTobeModified = getItemInfo(loadAllItems(), distinctItemList[i].barcode)
        itemTobeModified = calculateTheQuantity(itemTobeModified, distinctItemList[i].count)
        itemTobeModified = calculateSubTotal(itemTobeModified, distinctItemList[i].count)
        console.log('Debug here: ' + itemTobeModified.name + ' '+ itemTobeModified.quantity + ' '+ itemTobeModified.subtotal);
        boutghItemList.push(itemTobeModified);
    }
    receipt += generateBody(boutghItemList)
    console.log("receipt: "+receipt)
    receipt += generateTrailer(boutghItemList)
    return receipt
}

function generateHeader(){
  return '***<store earning no money>Receipt ***\n'
}

function generateBody(boutghItemList){
  var body = ''
  for(let i = 0; i<boutghItemList.length; i++){
    //'Name: Sprite, Quantity: 6 bottles, Unit price: 3.00 (yuan), Subtotal: 9.00 (yuan)\n'
    body += 'Name: '+ boutghItemList[i].name + ', Quantity: '+ boutghItemList[i].quantity +
               ', Unit price: ' + boutghItemList[i].price.toFixed(2) + ' (yuan)'+ ', Subtotal: ' + boutghItemList[i].subtotal.toFixed(2) + ' (yuan)'+ '\n'
  }
  //body = body.substr(0, body.length-1)
  return body
}

function generateTrailer(boutghItemList){
  // 'Total: 32.00 (yuan)\n'+
  //   'Saving: 10.50 (yuan)\n'+
  //   '**********************'
  var trailer ='----------------------\n'
  trailer += 'Total: '+ getTotal(boutghItemList).toFixed(2) + ' (yuan)\n'
  trailer += 'Saving: '+ getTotalSaving(boutghItemList).toFixed(2) + ' (yuan)\n'
  trailer += '**********************'
  return trailer
}

function getTotal(boutghItemList){
  var total = 0
  for(let i = 0; i< boutghItemList.length; i++){
    total += boutghItemList[i].subtotal
  }
  return total
}

function getTotalSaving(boutghItemList){
  var totalSaving = 0
  for(let i = 0; i< boutghItemList.length; i++){
    totalSaving += boutghItemList[i].saving
  }
  return totalSaving
}

function calculateTheQuantity(itemTobeModified, count){
  
  if (count === 1){
    itemTobeModified.quantity =count+ ' '+ itemTobeModified.quantity
  }else{
    if (itemTobeModified.quantity === 'kg'){
      itemTobeModified.quantity =count+ ' '+ itemTobeModified.quantity
    }else{
      itemTobeModified.quantity =count+ ' '+ itemTobeModified.quantity+'s'
    }
  }
  return itemTobeModified
}

function calculateSubTotal(itemTobeModified, count){
  if (count > 1){
    var subtotal = getSubTotal(itemTobeModified, count)
    var saving = getSaving(loadPromotions(),itemTobeModified, count)
    if(saving > 0){
      itemTobeModified.subtotal = subtotal - saving
    }else{
      itemTobeModified.subtotal = subtotal
    }
  }
  return itemTobeModified
}

function getSubTotal(itemTobeModified, count){
  console.log("get subTotal:" + itemTobeModified.price * count)
  return itemTobeModified.price * count
}

function getSaving(promotionList,itemTobeModified, count){
  var buy2get1free = promotionList.find(p => p.type === 'BUY_TWO_GET_ONE_FREE')
  //console.log("itemTobeModified.barcode: "+itemTobeModified.barcode + " count: "+ count + " unit_price: "+ itemTobeModified.price)
  if (buy2get1free.barcodes.includes(itemTobeModified.barcode)){
    var saving = Math.floor(count/2) * itemTobeModified.price
    console.log("itemTobeModified.barcode: "+itemTobeModified.barcode +" saving: " + saving)
    itemTobeModified.saving = saving
    return saving
  }
  itemTobeModified.saving =0
  return 0
}

function getItemInfo(allItem, barcode){
  var barcode = barcode
    for(let i=0; i<allItem.length;i++){
        if (allItem[i].barcode === barcode){
            var boughtItemInfo = {}
            boughtItemInfo.barcode = barcode
            boughtItemInfo.name = allItem[i].name
            boughtItemInfo.quantity = allItem[i].unit
            boughtItemInfo.price = allItem[i].price
            boughtItemInfo.subtotal = allItem[i].price
            return boughtItemInfo
        }
    }
    return null;
}

function filterDistinctItem(barcodeList){
  var distinctBarcodeList = [];
  var distinctItemList = [];
  for(let i=0; i<barcodeList.length; i++){
    if(!(distinctBarcodeList.includes(barcodeList[i]))){
      var distinctItem = {}
      var count = countNumOfItem(barcodeList, barcodeList[i])
      distinctBarcodeList.push(barcodeList[i])
      if(barcodeList[i].includes('-')){
        distinctItem.count = count
        distinctItem.barcode = barcodeList[i].split('-')[0] 
        distinctItemList.push(distinctItem)
      }else{
        distinctItem.count = count
        distinctItem.barcode = barcodeList[i] 
        distinctItemList.push(distinctItem)
      }
    }
  }
  return distinctItemList
}

function countNumOfItem(barcodeList, barcode){
    //var count = 0;
    if (barcode.includes('-')){
      console.log("split: "+barcode)
      return barcode.split('-')[1]
    }else{
      var itemWithSameBarcodeList = barcodeList.filter(b => b === barcode)
      return itemWithSameBarcodeList.length
    }
}

function loadAllItems() {
    return [
      {
        barcode: 'ITEM000000',
        name: 'Coca-Cola',
        unit: 'bottle',
        price: 3.00
      },
      {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      },
      {
        barcode: 'ITEM000002',
        name: 'Apple',
        unit: 'kg',
        price: 5.50
      },
      {
        barcode: 'ITEM000003',
        name: 'Litchi',
        unit: 'kg',
        price: 15.00
      },
      {
        barcode: 'ITEM000004',
        name: 'Battery',
        unit: 'box',
        price: 2.00
      },
      {
        barcode: 'ITEM000005',
        name: 'Noodles',
        unit: 'bag',
        price: 4.50
      }
    ];
  }

  function loadPromotions() {
    return [
      {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
          'ITEM000000',
          'ITEM000001',
          'ITEM000005'
        ]
      }
    ];
  }

module.exports = prinReceipt