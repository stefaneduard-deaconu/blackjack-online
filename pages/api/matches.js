// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// dummy method for returning data about the current matches
export default function games(req, res) {
    res.status(200).json({
        gamesPlaying: [
            {
                id: 101,
                player1: {
                    nickname: 'Eugene'
                },
                player2: {
                    nickname: 'Peter'
                }
            }
        ]
    })
}
