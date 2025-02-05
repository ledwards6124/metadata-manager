"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mp3io_1 = require("./io/mp3io");
const cors = require('cors');
const app = (0, express_1.default)();
const port = 5000;
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.get('/', (req, res) => {
    console.log('Ping from ' + req.ip);
    res.send('Hello World!');
});
app.get('/mp3', (req, res) => {
    const path = req.query.path;
    const tags = (0, mp3io_1.readMP3)(path);
    res.send(tags);
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map