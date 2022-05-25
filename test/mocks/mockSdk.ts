const mockFieldSdk = {
  field: {
    getValue: jest.fn(),
    onValueChanged: jest.fn(),
    setValue: jest.fn(),
    removeValue: jest.fn(),
    setInvalid: jest.fn(),
  },
  window: {
    startAutoResizer: jest.fn(),
  },
};

export { mockFieldSdk };
