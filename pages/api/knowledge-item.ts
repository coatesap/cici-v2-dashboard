import {withAdminCheck} from "@/lib/auth-server";
import {db} from "@/lib/database";

export default withAdminCheck(async (req, res) => {
    const {id = ''} = req.query
    if (id === '') {
        return res.status(400).json({errors: ['Query param "id" is required']})
    }

    const result = await db.query(
        `SELECT id, slug, title, region, audience, questions, "bodyText", "llmGuidance"
         FROM "knowledgeItem"
         WHERE id = $1
         LIMIT 1`, [id])

    const data = result.rows[0]
    if (!data) {
        return res.status(404).json({errors: ['Knowledge item not found']})
    }

    return res.status(200).json({data})
})
