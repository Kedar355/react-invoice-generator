import React, { useState } from 'react';
import { uid } from 'uid';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import incrementString from '../helpers/incrementString';

const date = new Date();
const today = date.toLocaleDateString('en-GB', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});

const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [cashierName, setCashierName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([
    {
      id: uid(6),
      name: '',
      qty: 1,
      price: '1.00',
    },
  ]);

  const reviewInvoiceHandler = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const addNextInvoiceHandler = () => {
    setInvoiceNumber((prevNumber) => incrementString(prevNumber));
    setItems([
      {
        id: uid(6),
        name: '',
        qty: 1,
        price: '1.00',
      },
    ]);
  };

  const addItemHandler = () => {
    const id = uid(6);
    setItems((prevItem) => [
      ...prevItem,
      {
        id: id,
        name: '',
        qty: 1,
        price: '1.00',
      },
    ]);
  };

  const deleteItemHandler = (id) => {
    setItems((prevItem) => prevItem.filter((item) => item.id !== id));
  };

  const edtiItemHandler = (event) => {
    const editedItem = {
      id: event.target.id,
      name: event.target.name,
      value: event.target.value,
    };

    const newItems = items.map((items) => {
      for (const key in items) {
        if (key === editedItem.name && items.id === editedItem.id) {
          items[key] = editedItem.value;
        }
      }
      return items;
    });

    setItems(newItems);
  };

  const subtotal = items.reduce((prev, curr) => {
    if (curr.name.trim().length > 0)
      return prev + Number(curr.price * Math.floor(curr.qty));
    else return prev;
  }, 0);
  const taxRate = (tax * subtotal) / 100;
  const discountRate = (discount * subtotal) / 100;
  const total = subtotal - discountRate + taxRate;

  return (
    <div className="min-h-screen bg-gray-50">
      <form
        className="relative flex flex-col gap-8 px-6 py-8 md:flex-row md:gap-12 lg:px-12"
        onSubmit={reviewInvoiceHandler}
      >
        {/* Left Section */}
        <div className="flex-1 space-y-8 rounded-lg bg-white p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col justify-between gap-6 border-b pb-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">Current Date:</span>
              <span className="text-sm font-medium text-gray-800">{today}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-600" htmlFor="invoiceNumber">
                Invoice Number:
              </label>
              <input
                required
                className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                type="number"
                name="invoiceNumber"
                id="invoiceNumber"
                min="1"
                step="1"
                value={invoiceNumber}
                onChange={(event) => setInvoiceNumber(event.target.value)}
              />
            </div>
          </div>

          {/* Invoice Title */}
          <h1 className="text-center text-2xl font-bold text-gray-800">REACT INVOICE GENERATOR</h1>

          {/* Cashier and Customer Info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="cashierName" className="block text-sm font-semibold text-gray-600">
                Cashier:
              </label>
              <input
                required
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Cashier name"
                type="text"
                name="cashierName"
                id="cashierName"
                value={cashierName}
                onChange={(event) => setCashierName(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="customerName" className="block text-sm font-semibold text-gray-600">
                Customer:
              </label>
              <input
                required
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Customer name"
                type="text"
                name="customerName"
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-3">ITEM</th>
                  <th className="py-3">QTY</th>
                  <th className="py-3 text-center">PRICE</th>
                  <th className="py-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <InvoiceItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    qty={item.qty}
                    price={item.price}
                    onDeleteItem={deleteItemHandler}
                    onEdtiItem={edtiItemHandler}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-600"
            type="button"
            onClick={addItemHandler}
          >
            Add Item
          </button>

          {/* Summary */}
          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-600">Discount:</span>
              <span className="font-medium text-gray-800">
                ({discount || '0'}%) - ₹{discountRate.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-600">Tax:</span>
              <span className="font-medium text-gray-800">
                ({tax || '0'}%) + ₹{taxRate.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-4 text-sm">
              <span className="font-semibold text-gray-800">Total:</span>
              <span className="font-bold text-gray-900">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-0 space-y-8">
            <button
              className="w-full rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-green-600"
              type="submit"
            >
              Review Invoice
            </button>
            <InvoiceModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              invoiceInfo={{
                invoiceNumber,
                cashierName,
                customerName,
                subtotal,
                taxRate,
                discountRate,
                total,
              }}
              items={items}
              onAddNextInvoice={addNextInvoiceHandler}
            />
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600" htmlFor="tax">
                  Tax rate:
                </label>
                <div className="mt-2 flex">
                  <input
                    className="w-full rounded-l-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    type="number"
                    name="tax"
                    id="tax"
                    min="0.01"
                    step="0.01"
                    placeholder="0.0"
                    value={tax}
                    onChange={(event) => setTax(event.target.value)}
                  />
                  <span className="rounded-r-md bg-gray-200 px-4 py-2 text-sm text-gray-500">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600" htmlFor="discount">
                  Discount rate:
                </label>
                <div className="mt-2 flex">
                  <input
                    className="w-full rounded-l-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    type="number"
                    name="discount"
                    id="discount"
                    min="0"
                    step="0.01"
                    placeholder="0.0"
                    value={discount}
                    onChange={(event) => setDiscount(event.target.value)}
                  />
                  <span className="rounded-r-md bg-gray-200 px-4 py-2 text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <footer className="mt-12 bg-gray-100 py-4 text-center">
        <p className=" text-gray-600 text-2xl">
          Made By{' '}
          <a
            href="https://kedar355.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-500 hover:underline"
          >
            Kedar
          </a>
        </p>
      </footer>
    </div>
  );
};

export default InvoiceForm;