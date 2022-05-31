/* -------------------------------------------------------------------------- */
/*                      queries for geting data from api                      */
/* -------------------------------------------------------------------------- */
const queries = {
    getUsername : async function(username) {
        return JSON.stringify({
            query: `{
                user(where: { login: { _eq: "${username}" } }){
                    login
                    id
                }
            }`
        })
    },
    getFinishedProjectIds : async function(username) {
        return JSON.stringify({
            query: `{
                user(where: { login: { _eq: "${username}" } }){
                    progresses (where:{isDone:{_eq:true}, path: {_regex: "div-01/(?!piscine-js.*/)"}},order_by:{createdAt:asc}){
                        objectId
                        createdAt
                    }
                }
            }`
        })
    },
    getProjectXP: async function(username, projectId) {
    return JSON.stringify({
        query: `{
            user(where: { login: { _eq: "${username}" } }){
                transactions(where:{type:{_eq: "xp"}, objectId:{_eq:${projectId}}}, order_by:{amount:desc}, limit:1){
                    amount
                    createdAt
                    object {
                        name
                    }
                }
            }
        }`
    })
},
    getSkills: async function(userId, offset){
        return JSON.stringify({
            query: `{
                transaction(order_by:{amount:asc}, where:{type:{_regex:"^skill"}, userId: { _eq: ${userId} }}, offset:${offset}){
                    amount
                    type
                }
            }`
        })
    },
    getJsPiscineStats: async function(userId, offset){
        return JSON.stringify({
            query:`{
                result(where:{userId:{_eq:${userId}},path:{_regex:"^/johvi/div-01/piscine-js"} type:{_eq:"tester"}}, order_by:{createdAt:asc}, offset:${offset}){
                    object{
                    name
                    }
                }
            }`
        })
    },
    getGoPiscineStats: async function(userId, offset){
        return JSON.stringify({
            query:`{
                result(where:{userId:{_eq:${userId}},path:{_regex:"^/johvi/piscine-go/(?!exam)"} type:{_eq:"tester"}}, order_by:{createdAt:asc}, offset:${offset}){
                    object{
                    name
                    }
                }
            }`
        })
    }
}
