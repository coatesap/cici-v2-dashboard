import {withAdminCheck} from "@/lib/auth-server";
import {db} from "@/lib/database";

export default withAdminCheck(async (req, res) => {

    const {id = ''} = req.query
    if (id === '') {
        return res.status(400).json({
            error: `Query param "id" is required for this endpoint`
        })
    }

    try {
        await db.query(
            `DELETE
             FROM "imageItem"
             WHERE id = $1`,
            [id]
        )
        return res.status(204).send('')
    } catch (err) {
        console.log(err.stack)
        return res.status(500).json({error: err.message})
    }
})
