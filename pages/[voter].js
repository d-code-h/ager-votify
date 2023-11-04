import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/voters.module.css';

export default function Voters() {
  const router = useRouter();
  const [all, updateAll] = useState([]);
  const [msg, setmsg] = useState('Loading...');
  const [position, setposition] = useState('face of 100');
  const [candidates, setcandidates] = useState([]);
  const [voted, setvoted] = useState(false);
  const [votes, updatevotes] = useState([]);
  const [user, setuser] = useState('loading');
  const [matric, setmatric] = useState('');
  const [sub_conf, setsub_conf] = useState(false);
  const [voterr, setvoterr] = useState(false);
  const [votelength, updatevotelength] = useState({ token: 0 });
  const [post, setPost] = useState(false);
  const [tosubmit, settosubmt] = useState(false);

  const [load, setLoad] = useState(false);
  // console.log(candidates);

  const positionChances = () => {
    if (all.length > 0) {
      let currentCandidate = all.filter((c) => c.position === position);

      if (tosubmit === false) {
        currentCandidate = currentCandidate.sort((a, b) => b.vote - a.vote);
      }

      if (currentCandidate.length > 0) {
        setcandidates(currentCandidate);
      } else {
        setcandidates([]);
        setmsg('No candidate for this position yet.');
      }
    } else {
      setmsg('Loading...');
    }
  };

  useEffect(() => {
    const userExist = async () => {
      const query = router.query;
      if (query.y === undefined) {
        return router.push('/login');
      }
      setmatric(query.y + '/' + query.s + '/' + query.c);
      setLoad(true);
      if (query.p !== 'Admin') {
        settosubmt(true);
      }
      const res = await fetch('/api/voter/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        if (all.length === 0) {
          all.push(...data.candidates);
          positionChances();
        }
      } else {
        setmsg(data['message']);
      }
    };
    userExist();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleVote = (e) => {
    const votedcandidate = candidates[e];

    votes[position] === votedcandidate.matric
      ? updatevotes({ ...votes, [position]: '' })
      : updatevotes({ ...votes, [position]: votedcandidate.matric });
  };

  useEffect(() => {
    let num = 0;
    for (let c in votes) {
      if (votes[c] !== '') {
        num = num + 1;
      } else {
      }
    }
    updatevotelength({ ...votelength, token: num });
  }, [votes]);

  const handleVoteSubmission = async () => {
    setvoterr(true);
    if (matric !== '') {
      const res = await fetch('/api/voters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          votes: votes,
          user: matric,
        }),
      });
      const data = await res.json();

      if (res.status === 200) {
        setvoted(true);
        setmsg(data.message);
      } else {
        setmsg(data.message);
      }
    }
  };

  useEffect(() => {
    positionChances();
  }, [position]);
  return (
    <>
      {load && (
        <>
          <Head>
            <title>Ager 500 - Voting</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/photo.jpg" />
          </Head>
          <main className={!voted ? styles.main : styles.main_voted}>
            <div
              className={
                !voted && sub_conf ? styles.sub_conf : styles.sub_conf_hide
              }
            >
              <div className={styles.sub_cont}>
                <h2 className={styles.sub_cont_heading}>
                  Submission Confirmation
                </h2>
                <p className={styles.sub_cont_msg}>
                  You are about to vote for <b>{votelength['token']}</b>{' '}
                  candidate
                  {votelength['token'] > 1 ? 's' : ''} out of <b>49</b>.{' '}
                  <span className={styles.sub_cont_note}>
                    Are you okay with that?
                  </span>
                </p>
                {votelength['token'] === 0 && (
                  <p className={styles.sub_cont_err}>
                    <span className={styles.alarm}>NOTE:</span> You can&apos;t
                    submit 0 vote.
                  </p>
                )}
                <div className={styles.sub_cont_btns}>
                  <button
                    className={!voterr ? styles.not_sure : styles.not_sure_err}
                    type="button"
                    onClick={() => {
                      setsub_conf(false);
                    }}
                  >
                    Not at all
                  </button>
                  <button
                    className={
                      votelength['token'] !== 0 && !voterr
                        ? styles.sure
                        : styles.sure_err
                    }
                    type="button"
                    onClick={() => {
                      handleVoteSubmission();
                    }}
                  >
                    Sure
                  </button>
                </div>
              </div>
            </div>
            {!voted ? (
              <>
                <div className={styles.content}>
                  <form
                    action="#"
                    method="GET"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className={styles.position}>
                      <select
                        name="position"
                        className={styles.position_select}
                        value={position}
                        onChange={(e) => setposition(e.target.value)}
                      >
                        <option value="face of 100">FACE OF 100</option>
                        <option value="face of 200">FACE OF 200</option>
                        <option value="face of 300">FACE OF 300</option>
                        <option value="face of 400">FACE OF 400</option>
                        <option value="final year student of the year">
                          FINAL YEAR STUDENT OF THE YEAR
                        </option>
                        <option value="campus face of Gk">
                          CAMPUS FACE OF GK
                        </option>
                        <option value="campus face of bosso">
                          CAMPUS FACE OF BOSSO
                        </option>
                        <option value="face of Semt">FACE OF SEMT </option>
                        <option value="face of Saat">FACE OF SAAT </option>
                        <option value="face of Sste">FACE OF SSTE </option>
                        <option value="face of SIpet">FACE OF SIPET </option>
                        <option value="face of Sps">FACE OF SPS </option>
                        <option value="face of Sls">FACE OF SLS </option>
                        <option value="face of seet">FACE OF SEET </option>
                        <option value="face of sict">FACE OF SICT</option>
                        <option value="face of Set">FACE OF SET </option>
                        <option value="Sportsman of the year">
                          SPORTSMAN OF THE YEAR{' '}
                        </option>
                        <option value="cool Calm and Collected">
                          COOL CALM AND COLLECTED{' '}
                        </option>
                        <option value="Best wardrobe male">
                          BEST WARDROBE MALE{' '}
                        </option>
                        <option value="Best wardrobe female">
                          BEST WARDROBE FEMALE{' '}
                        </option>
                        <option value="Model of the Year">
                          MODEL OF THE YEAR{' '}
                        </option>

                        <option value="Photographer of the year">
                          PHOTOGRAPHER OF THE YEAR
                        </option>
                        <option value="Entrepreneur of the year">
                          ENTREPRENEUR OF THE YEAR{' '}
                        </option>
                        <option value="best clique">BEST CLIQUE</option>

                        <option value="Hourglass">HOURGLASS</option>
                        <option value="mr ebony">MR EBONY </option>
                        <option value="Miss ebony">MISS EBONY </option>
                        <option value="most social">MOST SOCIAL </option>
                        <option value="Comedian of the year">
                          COMEDIAN OF THE YEAR{' '}
                        </option>
                        <option value="Dj of the year">DJ OF THE YEAR </option>
                        <option value="Most popular male">
                          MOST POPULAR MALE
                        </option>
                        <option value="Most popular female">
                          MOST POPULAR FEMALE{' '}
                        </option>
                        <option value="Slim shady">SLIM SHADY </option>
                        <option value="OAP of the year (searchfm )">
                          OAP OF THE YEAR (SEARCHFM ){' '}
                        </option>
                        <option value="Artist of the year">
                          ARTIST OF THE YEAR{' '}
                        </option>
                        <option value="Content creator of the year">
                          CONTENT CREATOR OF THE YEAR{' '}
                        </option>
                        <option value="Vibrant Statement">
                          VIBRANT STATEMENT{' '}
                        </option>
                        <option value="Faculty President of Year (19/20)">
                          FACULTY PRESIDENT OF YEAR (19/20){' '}
                        </option>
                        <option value="Most political">MOST POLITICAL </option>

                        <option value="Scholar of the year">
                          SCHOLAR OF THE YEAR{' '}
                        </option>
                        <option value="Big Bold and Beautiful">
                          BIG BOLD AND BEAUTIFUL{' '}
                        </option>
                        <option value="Graphic designer or the year">
                          GRAPHIC DESIGNER OR THE YEAR
                        </option>
                        <option value="Most expensive">MOST EXPENSIVE </option>
                        <option value="Techpreneur of the Year">
                          TECHPRENEUR OF THE YEAR
                        </option>
                        <option value="Business Icon of the Year">
                          BUSINESS ICON OF THE YEAR
                        </option>
                      </select>
                    </div>
                  </form>

                  <div className={styles.voters}>
                    {candidates.length > 0 ? (
                      candidates.map((candidate, i) => (
                        <div className={styles.profile} key={candidate._id}>
                          
                          <Image
                            className={styles.profile_img}
                            src={`https://res.cloudinary.com/david1/${candidate.img}`}
                            alt="Candidate Profile"
                            width={160}
                            height={160}
                          />
                          <div className={styles.profile_cont}>
                            <div className={styles.profile_cont_msg}>
                              <h2 className={styles.fname}>
                                {candidate.fname} {candidate.lname}
                              </h2>
                              <h4 className={styles.nick}>{candidate.nick}</h4>
                              <h4 className={styles.level}>
                                {candidate.faculty}
                              </h4>
                            </div>
                            {tosubmit === true ? (
                              <button
                                type="button"
                                className={
                                  votes[position] === candidate.matric
                                    ? styles.profile_voted
                                    : styles.profile_vote
                                }
                                onClick={() => handleVote(i)}
                              >
                                Vote
                                {votes[position] === candidate.matric
                                  ? 'd'
                                  : ''}
                              </button>
                            ) : (
                              // post === true && (
                              <button
                                type="button"
                                className={styles.profile_vote}
                              >
                                {candidate.vote} votes
                              </button>
                              // )
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.loading}>
                        <h1>{msg}</h1>
                      </div>
                    )}
                    {tosubmit === true && (
                      <button
                        type="submit"
                        className={styles.btn}
                        onClick={() => {
                          setsub_conf(true);
                          // handleVoteSubmission();
                        }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.after_reg}>
                <p>Voting Successful!</p>
                <p>Thank you!!!</p>
                <p className={styles.emoji}>&#128151;</p>
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
}
