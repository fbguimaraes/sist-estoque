import User from '#models/user';
import { registerValidator, loginValidator } from '#validators/auth';
export default class AuthController {
    async register({ request, response }) {
        const data = await registerValidator.validate(request.all());
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'user',
        });
        const token = await User.accessTokens.create(user);
        return response.created({
            user,
            token: token.value?.release(),
        });
    }
    async login({ request, response }) {
        const { email, password } = await loginValidator.validate(request.all());
        const user = await User.verifyCredentials(email, password);
        const token = await User.accessTokens.create(user);
        return response.ok({
            user,
            token: token.value?.release(),
        });
    }
    async me({ auth, response }) {
        const user = auth.use('api').user;
        return response.ok(user);
    }
    async logout({ auth, response }) {
        const user = auth.use('api').user;
        const token = auth.use('api').token;
        await User.accessTokens.delete(user, token);
        return response.noContent();
    }
}
//# sourceMappingURL=auth_controller.js.map