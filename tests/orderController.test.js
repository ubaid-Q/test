import { OrderController } from '../src/handler';

export const PrismaClient = jest.fn(() => ({
  order: {
    create: jest.fn(),
  },
}));

jest.mock('../src/worker');

const snapshotEngineMock = {
  restoreState: jest.fn(),
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body) => {
  return { body };
};

describe('OrderController', () => {
  let orderController;

  beforeEach(() => {
    orderController = new OrderController(snapshotEngineMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new order and return a success response', async () => {
      const req = mockRequest({ side: 'BUY', price: 100 });
      const res = mockResponse();

      await orderController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'BUY order created successfully',
      });
    });

    it('should return a 400 error response when side and price are missing', async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await orderController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'side & price are required',
      });
    });
  });

  describe('matchOrders', () => {
    it('should match orders with the same price on opposite sides', async () => {
      const newOrder = { id: 1, side: 'BUY', price: 100 };
      await orderController.create(mockRequest(newOrder), mockResponse());

      const matchingOrder = { id: 2, side: 'SELL', price: 100 };
      const matched = await orderController.matchOrders(matchingOrder);

      expect({ ...matched, id: newOrder.id }).toEqual(newOrder);
    });

    it('should not match orders with different prices', async () => {
      const newOrder = { id: 1, side: 'BUY', price: 100 };
      await orderController.create(mockRequest(newOrder), mockResponse());

      const matchingOrder = { id: 2, side: 'SELL', price: 150 };
      const matched = await orderController.matchOrders(matchingOrder);

      expect(matched).toBe(false);
    });
  });
});
