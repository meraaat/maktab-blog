import path from 'path';


export default { 
    ENGINE: 'ejs',
    VIEW_DIR: path.resolve('./views'),
    LAYOUT: {
        USER_MASTER: 'user-master',
        ADMIN_MASTER: 'admin-master',
        LAYOUT_EXTRACT_SCRIPTS: true,
        LAYOUT_EXTRACT_STYLES: true
    }
}