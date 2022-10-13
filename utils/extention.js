


module.exports.isNotEmpty = function isNotEmpty(object)
{
    if (!object)
        return false
    return Object.keys(object).length !== 0
}

