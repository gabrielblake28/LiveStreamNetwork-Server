import sinonChai from "sinon-chai";
import sinon from "sinon";
import chai, { expect } from "chai";
import MessageService from "../common/message/MessageService";
chai.use(sinonChai);

describe("MessageService", () => {
    it("should return object with data and status", () => {
        const result = MessageService.sendSuccess(200, {});

        expect(result).to.eql({ status: 200, data: {} });
    });

    it("should return object with error and status", () => {
        const ERROR = new Error("Error");

        const result = MessageService.sendFailure(500, "Error");

        expect(result).to.eql({
            error: { error: { status: 500, message: "Error" } },
            status: 500,
        });
    });
});
