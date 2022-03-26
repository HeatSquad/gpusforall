const apiArray = []
module.exports = apiArray;

async function replyto_jsonSomeTypeOfFunction(req, res)
{
    res.send('werid text here harlan likes hot dogs like a lot of them in his mouth at once')
}

apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonSomeTypeOfFunction,
        path: 'jsonSomeTypeOfFunction',
        options:
        {
            public: true,
            description: 'does something',
            group: 'random test api function'
        }
    }
)