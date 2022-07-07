module.exports = 
{
    devServer:
    {
        port: 8080
    },
    outputDir: 'sys_webserver/dist',
    chainWebpack: config => {
        config.entry('app').clear();
        config.entry('app').add('./sys_webserver/src/main.js');
    }
}