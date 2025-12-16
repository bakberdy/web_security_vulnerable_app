"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return {
        id: request.session?.userId,
        email: request.session?.userEmail,
        role: request.session?.userRole,
    };
});
//# sourceMappingURL=current-user.decorator.js.map