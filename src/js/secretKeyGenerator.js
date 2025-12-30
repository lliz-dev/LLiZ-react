import { authenticator } from '@otplib/preset-browser';

function secretKeyGenerator() {
    const secret = authenticator.generateSecret();
    return secret;
}
export default secretKeyGenerator;

