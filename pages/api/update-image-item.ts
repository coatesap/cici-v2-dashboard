import {withAdminCheck} from "@/lib/auth-server";
import {db} from "@/lib/database";
import {createImageItemValidator} from "@/lib/imageItem";
import type {NextApiRequest, NextApiResponse} from "next";

export default withAdminCheck(async (req: NextApiRequest, res: NextApiResponse) => {

    const {id = null} = req.query

    const numericId = Number(id)
    if (isNaN(numericId)) {
        return res.status(400).json({errors: ['id must be a number']})
    }

    const rawData = req.body

    // Trim all strings
    const trimmedData: Record<string, unknown> = {}
    Object.entries(rawData).forEach(([k, v]) => {
        trimmedData[k] = (typeof v === 'string')
            ? v.trim()
            : v
    })

    const validated: Record<string, unknown> = {}
    const errors: string[] = []

    // Validate data
    const validator = createImageItemValidator()
    Object.entries(trimmedData).forEach(([k, v]) => {
        try {
            if (!Object.keys(validator).includes(k)) {
                throw new Error(`Unknown field "${k}" supplied`)
            }
            validator[k](v)
            validated[k] = v
        } catch (e) {
            errors.push((e as Error).message)
        }
    })
    if (errors.length) {
        return res.status(400).json({errors})
    }

    // Save data to database
    const keys = Object.keys(validated)
        .map(k => `"${k}"`)
        .join(',')

    const placeholders = Object.keys(validated)
        .map((_, i) => `$${i + 1}`)
        .join(',')
    const sql = `UPDATE "imageItem"
                 SET (${keys}) = (${placeholders})
                 WHERE id = $${Object.keys(validated).length + 1}
                 RETURNING *`

    try {
        const result = await db.query(sql, [...Object.values(validated), numericId])
        return res.status(200).json({data: result.rows[0]});
    } catch (err) {
        console.log((err as Error).stack)
        return res.status(500).json({errors: [(err as Error).message]})
    }
})
