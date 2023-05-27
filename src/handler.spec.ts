import { json, Request, Response } from "express"
import { Auth } from "./handler"

const email = `User${Date.now().toFixed(5)}@gmail.com`
describe('Auth', () => {
    let req: Partial<Request>
    let res: Partial<Response>

    const { register } = new Auth
    beforeEach(() => {
        req = {
            body: {
                name: 'test123',
                email,
                password: "Abcd@123"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });
    it('Should Register user', async () => {
        await register(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(201)
    })
})

describe('Auth', () => {
    let req: Partial<Request>
    let res: Partial<Response>

    const { register, login } = new Auth
    beforeEach(() => {
        req = {
            body: {
                email,
                password: "Abcd@123"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });
    it('Should login user', async () => {
        await login(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200)
    })
})