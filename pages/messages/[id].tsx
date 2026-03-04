import Head from "next/head";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Spinner} from "@blueprintjs/core";
import MarkdownIt from "markdown-it";
import Header from "@/components/Header";
import ScreenHeader from "@/components/ScreenHeader";
import {withAdminUser} from "@/lib/auth";

interface Message {
    id: string;
    userText: string;
    responseText: string;
    createdAt: string;
}

interface MessageVote {
    vote: 'up' | 'down';
    reason: string | null;
    details: string | null;
    createdAt: string;
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
});

function MessagePage() {
    const router = useRouter();
    const {id} = router.query;
    const [message, setMessage] = useState<Message | null>(null);
    const [vote, setVote] = useState<MessageVote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/message?id=${id}`)
            .then((res) => {
                if (!res.ok) throw new Error(res.status === 404 ? 'Message not found' : 'Failed to load message');
                return res.json();
            })
            .then(({data, vote}) => {
                setMessage(data);
                setVote(vote);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="min-h-screen" style={{backgroundColor: '#E8E6E5'}}>
            <Head>
                <title>Message {id} - CiCi Dashboard</title>
            </Head>

            <Header tenant={null}/>

            <div className="mx-auto max-w-4xl px-4 mt-4 pb-10">
                <ScreenHeader
                    title="Message"
                    backLink="/feedback"
                />

                {loading && <Spinner/>}

                {error && (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center text-red-600">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <p className="text-sm text-gray-500 mb-6">
                            {new Date(message.createdAt).toLocaleString()}
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">User Message</h3>
                        <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-6 bg-gray-50 rounded">
                            <p className="text-gray-700 whitespace-pre-wrap">{message.userText}</p>
                        </blockquote>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Bot Response</h3>
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{__html: md.render(message.responseText || '')}}
                        />

                        {vote && (
                            <>
                                <hr className="my-6 border-gray-200"/>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">User Feedback</h3>
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                                    vote.vote === 'up'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {vote.vote === 'up' ? 'Upvoted' : 'Downvoted'}
                                </div>
                                {vote.reason && (
                                    <p className="text-gray-700 mt-2"><span className="font-medium">Reason:</span> {vote.reason}</p>
                                )}
                                {vote.details && (
                                    <p className="text-gray-700 mt-1"><span className="font-medium">Details:</span> {vote.details}</p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAdminUser(MessagePage);
