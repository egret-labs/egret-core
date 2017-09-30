
import * as path from 'path';


export default {
    name: "manifest",
    onFile: async (file) => {
        const filename = file.original_relative;
        const extname = path.extname(filename);
        if (extname == ".js" && !file.isExistedInResourceFolder) {
            const crc32 = globals.getCrc32();
            const crc32_file_path = crc32(file.contents);
            const origin_path = file.original_relative;
            const new_file_path = origin_path.substr(0, origin_path.length - file.extname.length) + "_" + crc32_file_path + file.extname;
            file.path = path.join(file.base, new_file_path);
        }
        return file;

    },
    onFinish: async () => {

    }
}