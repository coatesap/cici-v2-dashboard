import {withAdminCheck} from "@/lib/auth-server";
import {db} from "@/lib/database";

export default withAdminCheck(async (req, res) => {
    const sql = `SELECT id, slug, title, url
                 FROM "imageItem"
                 ORDER BY lower(title)`

    const data = (await db.query(sql)).rows;
    return res.status(200).json({data});
})
