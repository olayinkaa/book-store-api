module.exports = {
    formatResponseError: (err)=>{
        return err.details.reduce((acc,item)=>{
            return {
                ...acc,
                [item.path[0]]:item.message
            }
        },{})
    },
    //
}