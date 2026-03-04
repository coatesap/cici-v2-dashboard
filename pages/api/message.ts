import {withAdminCheck} from "@/lib/auth-server";
import {db} from "@/lib/database";

export default withAdminCheck(async (req, res) => {
    const {id} = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({error: 'Missing id parameter'});
    }

    try {
        const result = await db.query(
            `SELECT "id", "userText", "responseText", "createdAt" FROM "message" WHERE "id" = $1 LIMIT 1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Message not found'});
        }

        const voteResult = await db.query(
            `SELECT "vote", "reason", "details", "createdAt" FROM "messageVote" WHERE "messageId" = $1 LIMIT 1`,
            [id]
        );

        return res.status(200).json({
            data: result.rows[0],
            vote: voteResult.rows[0] || null,
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({error: err.message});
    }
});
