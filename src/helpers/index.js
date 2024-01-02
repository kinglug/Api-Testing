import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import { inspect } from 'util';
import fs from 'fs';
import { parse } from 'node-html-parser';


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const imapConfig = { 
    user: 'duy.tran17061995@gmail.com',
    password: 'knyjvmslwmfghwfl',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
};

export const imap = new Imap(imapConfig);
export var linkVerify = {
    text: ''
}

const getEmails = () => {
    try {
        console.log("Start get emails")
        imap.once('ready', () => {
            imap.openBox('INBOX', false, () => {
                imap.search(['UNSEEN', ['ON', new Date()]], (err, results) => {
                    const f = imap.fetch(results, { bodies: '' });
                    f.on('message', msg => {
                        msg.on('body', stream => {
                            simpleParser(stream, async (err, parsed) => {
                                const emailSubject = parsed.subject;
                                const emailBody = parsed.html;
                                const root = parse(emailBody);
                                console.log("Subject: " + emailSubject);
                                root.getElementsByTagName("a").forEach(item => {
                                    let link = item.getAttribute("href")
                                    console.log("Link: "+ link)
                                    let matchURL = link.match(/https:\/\/accounts.*\/verify-url.*/g)
                                    if (matchURL){
                                        let verifyURL = new URL(matchURL);
                                        linkVerify = verifyURL.searchParams.get("url");
                                        console.log("Link Verify: ", linkVerify);
                                    }
                                });                                
                            });
                        });
                        msg.once('attributes', attrs => {
                            const { uid } = attrs;
                            imap.addFlags(uid, ['\\Seen'], () => {
                                // Mark the email as read after reading it
                                console.log('Marked as read!');
                            });
                        });
                    });
                    f.once('error', ex => {
                        return Promise.reject(ex);
                    });
                    f.once('end', () => {
                        console.log('Done fetching all messages!');
                        imap.end();
                    });
                });
            });
        });

        imap.once('error', err => {
            console.log(err);
        });

        imap.once('end', () => {
            console.log('Connection ended');
        });

        imap.connect();
    } catch (ex) {
        console.log('an error occurred');
    }
};

export default getEmails;

