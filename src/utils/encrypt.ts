import { hash, compare , genSalt} from 'bcryptjs';


export const encode =  async (content: string) => {
    try {
        const salt = await genSalt(10);
        const hashedContent = await hash(content, salt)
        return hashedContent;
    } catch (err) {
        throw err;
    }
}

export const check = async (content : string, hashedContent :string) => {
    try {
        return await compare(content, hashedContent);
    } catch (err) {
        throw err;
    }
}