var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Fetcher = require('./src/fetcher');

var fetcher = new Fetcher(io);

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
})

app.get('/repositories', function (req, res) {
  res.json(fetcher.TodayRepos());
})

app.get('/metrics', function (req, res) {
  res.json(fetcher.Metrics());
})

app.get('/top', function (req, res) {
  res.json([{
        "id": 29643512,
        "name": "automated-chrome-profiling",
        "full_name": "paulirish/automated-chrome-profiling",
        "owner": {
            "login": "paulirish",
            "id": 39191,
            "avatar_url": "https://avatars.githubusercontent.com/u/39191?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/paulirish",
            "html_url": "https://github.com/paulirish",
            "followers_url": "https://api.github.com/users/paulirish/followers",
            "following_url": "https://api.github.com/users/paulirish/following{/other_user}",
            "gists_url": "https://api.github.com/users/paulirish/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/paulirish/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/paulirish/subscriptions",
            "organizations_url": "https://api.github.com/users/paulirish/orgs",
            "repos_url": "https://api.github.com/users/paulirish/repos",
            "events_url": "https://api.github.com/users/paulirish/events{/privacy}",
            "received_events_url": "https://api.github.com/users/paulirish/received_events",
            "type": "User",
            "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/paulirish/automated-chrome-profiling",
        "description": "",
        "fork": false,
        "url": "https://api.github.com/repos/paulirish/automated-chrome-profiling",
        "forks_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/forks",
        "keys_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/teams",
        "hooks_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/hooks",
        "issue_events_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/issues/events{/number}",
        "events_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/events",
        "assignees_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/assignees{/user}",
        "branches_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/branches{/branch}",
        "tags_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/tags",
        "blobs_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/languages",
        "stargazers_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/stargazers",
        "contributors_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/contributors",
        "subscribers_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/subscribers",
        "subscription_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/subscription",
        "commits_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/contents/{+path}",
        "compare_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/merges",
        "archive_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/downloads",
        "issues_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/issues{/number}",
        "pulls_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/labels{/name}",
        "releases_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/releases{/id}",
        "created_at": "2015-01-22T02:19:02Z",
        "updated_at": "2015-01-22T13:44:31Z",
        "pushed_at": "2015-01-22T02:34:34Z",
        "git_url": "git://github.com/paulirish/automated-chrome-profiling.git",
        "ssh_url": "git@github.com:paulirish/automated-chrome-profiling.git",
        "clone_url": "https://github.com/paulirish/automated-chrome-profiling.git",
        "svn_url": "https://github.com/paulirish/automated-chrome-profiling",
        "homepage": "https://github.com/paulirish/automated-chrome-profiling#readme",
        "size": 0,
        "stargazers_count": 18,
        "watchers_count": 18,
        "language": null,
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": false,
        "has_pages": false,
        "forks_count": 2,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 2,
        "open_issues": 0,
        "watchers": 18,
        "default_branch": "master",
        "score": 0.2228292,
        "README": {
            "name": "readme.md",
            "path": "readme.md",
            "sha": "f735013f30cbaed0103e49a52ee829c2cc09ad12",
            "size": 3101,
            "url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/contents/readme.md?ref=master",
            "html_url": "https://github.com/paulirish/automated-chrome-profiling/blob/master/readme.md",
            "git_url": "https://api.github.com/repos/paulirish/automated-chrome-profiling/git/blobs/f735013f30cbaed0103e49a52ee829c2cc09ad12",
            "download_url": "https://raw.githubusercontent.com/paulirish/automated-chrome-profiling/master/readme.md",
            "type": "file",
            "content": "TGV0J3Mgc2F5IHlvdSB3YW50IHRvIGV2YWx1YXRlIHRoZSBwZXJmb3JtYW5j\nZSBvZiBzb21lIEphdmFTY3JpcHQgYW5kIHdhbnQgdG8gYXV0b21hdGUgaXQg\nYXMgbXVjaCBhcyBwb3NzaWJsZS4gTGV0J3MgZG8gdGhhdCEKCldlIHdhbnQg\ndG8gdXNlIHRoZSBbQ2hyb21lIGRlYnVnZ2luZyBwcm90b2NvbF0oaHR0cHM6\nLy9kZXZlbG9wZXIuY2hyb21lLmNvbS9kZXZ0b29scy9kb2NzL2RlYnVnZ2Vy\nLXByb3RvY29sKSBhbmQgZ28gZGlyZWN0bHkgdG8gW2hvdyBDaHJvbWUncyBK\nUyBzYW1wbGluZyBwcm9maWxlciBpbnRlcmFjdHMgd2l0aCBWOF0oaHR0cHM6\nLy9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9jb2Rlc2VhcmNoI2Nocm9t\naXVtL3NyYy90aGlyZF9wYXJ0eS9XZWJLaXQvU291cmNlL2RldnRvb2xzL3By\nb3RvY29sLmpzb24mcT1wcm90b2NvbC5qc29uJTIwJTIyZG9tYWluJTIyOiUy\nMCUyMlByb2ZpbGVyJTIyJnNxPXBhY2thZ2U6Y2hyb21pdW0mdHlwZT1jcyku\nCgpCdXQgd2UnbGwgdXNlIFtjaHJvbWUtcmVtb3RlLWludGVyZmFjZV0oaHR0\ncHM6Ly9naXRodWIuY29tL2N5cnVzLWFuZC9jaHJvbWUtcmVtb3RlLWludGVy\nZmFjZSkgYXMgYSBuaWNlIGNsaWVudCBpbiBmcm9udCBvZiBpdDoKCiAgICBu\ncG0gaW5zdGFsbCBjaHJvbWUtcmVtb3RlLWludGVyZmFjZQogICAgClJ1biBD\naHJvbWUgd2l0aCBhbiBvcGVuIGRlYnVnZ2luZyBwb3J0OgoKICAgICMgbGlu\ndXgKICAgIGdvb2dsZS1jaHJvbWUgLS1yZW1vdGUtZGVidWdnaW5nLXBvcnQ9\nOTIyMgogICAKICAgICMgbWFjCiAgICAvQXBwbGljYXRpb25zL0dvb2dsZVwg\nQ2hyb21lLmFwcC9Db250ZW50cy9NYWNPUy9Hb29nbGVcIENocm9tZSAtLXJl\nbW90ZS1kZWJ1Z2dpbmctcG9ydD05MjIyCiAgIAoKIyMgTGV0J3MgcHJvZmls\nZSEKCldlJ3JlIGFib3V0IHRv4oCmCgoqIE9wZW4gaHR0cDovL2xvY2FsaG9z\ndDo4MDgwL3BlcmYtdGVzdC5odG1sCiogU3RhcnQgcHJvZmlsaW5nCiogcnVu\nIGBzdGFydFRlc3QoKTtgCiogU3RvcCBwcm9maWxpbmcgYW5kIHJldHJpZXZl\nIHRoZSBwcm9maWxpbmcgcmVzdWx0CiogTG9hZCB0aGUgZGF0YSBpbnRvIENo\ncm9tZSBEZXZUb29scwohW10oaHR0cDovL2kuaW1ndXIuY29tL3pBWmEzaVUu\nanBnKQoKIyMjIyBDb2RlCmBgYGpzCnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7\nCnZhciBDaHJvbWUgPSByZXF1aXJlKCdjaHJvbWUtcmVtb3RlLWludGVyZmFj\nZScpOwpDaHJvbWUoZnVuY3Rpb24gKGNocm9tZSkgewogICAgd2l0aCAoY2hy\nb21lKSB7CiAgICAgICAgUGFnZS5lbmFibGUoKTsKICAgICAgICBQYWdlLm5h\ndmlnYXRlKHsndXJsJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9wZXJmLXRl\nc3QuaHRtbCd9LCBmdW5jdGlvbigpewogICAgICAgICAgICBSdW50aW1lLmVu\nYWJsZSgpOwogICAgICAgICAgICBQcm9maWxlci5lbmFibGUoKTsKICAgICAg\nICAgICAgUHJvZmlsZXIuc2V0U2FtcGxpbmdJbnRlcnZhbCgxMDApOyAvLyAx\nMDAgbWljcm9zZWNvbmQgc2FtcGxpbmcgcmVzb2x1dGlvbiwgKDEwMDAgaXMg\nZGVmYXVsdCkKICAgICAgICAgICAgCiAgICAgICAgICAgIFByb2ZpbGVyLnN0\nYXJ0KCk7CiAgICAgICAgICAgIFJ1bnRpbWUuZXZhbHVhdGUoeyAiZXhwcmVz\nc2lvbiI6ICIgc3RhcnRUZXN0KCk7ICIgfSk7CiAgICAgICAgICAgIAogICAg\nICAgICAgICAvLyBmb3Igbm93LCBoYWNreSAxMCBzZWNvbmQgdGltZW91dC4g\nQ291bGQgYmUgYmV0dGVyLgogICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0\naW9uKCl7CiAgICAgICAgICAgICAgICBQcm9maWxlci5zdG9wKHt9LCBzYXZl\nUHJvZmlsZSk7CiAgICAgICAgICAgIH0sIDEwKjEwMDApOwogICAgICAgIH0p\nOwogICAgfQp9KS5vbignZXJyb3InLCBmdW5jdGlvbiAoKSB7CiAgICBjb25z\nb2xlLmVycm9yKCdDYW5ub3QgY29ubmVjdCB0byBDaHJvbWUnKTsKfSk7CgoK\nZnVuY3Rpb24gc2F2ZVByb2ZpbGUobmFtZSwgQ1BVUHJvZmlsZSwgZGVzYyl7\nCiAgICAvLyBDUFVQcm9maWxlIG9iamVjdCBkZXNjcmliZWQgaGVyZToKICAg\nIC8vICAgY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vY29kZXNlYXJjaCNj\naHJvbWl1bS9zcmMvdGhpcmRfcGFydHkvV2ViS2l0L1NvdXJjZS9kZXZ0b29s\ncy9wcm90b2NvbC5qc29uJnE9cHJvdG9jb2wuanNvbiUyMENQVVByb2ZpbGVO\nb2RlJnNxPXBhY2thZ2U6Y2hyb21pdW0mdHlwZT1jcwoKICAgIC8vIGVpdGhl\ncjoKICAgIC8vIDEuIHByb2Nlc3MgdGhlIGRhdGEgaW4gbm9kZSBvciDigKYK\nICAgIC8vIDIuIHNhdmUgYXMgSlNPTiB0byBkaXNrLCBvcGVuIENocm9tZSBE\nZXZUb29scywgUHJvZmlsZXMgdGFiLCBzZWxlY3QgQ1BVIFByb2ZpbGUgcmFk\naW8gYnV0dG9uLCBjbGljayBgbG9hZGAKICAgIC8vICAgIGFuZCB2aWV3IHRo\nZSBwcm9maWxlIGRhdGEgaW4gdGhlIGZ1bGwgZGV2dG9vbHMgVUkuCiAgICAK\nICAgIHZhciBmaWxlID0gJ3Byb2ZpbGUtJyArIERhdGUubm93KCkgKyAnLmNw\ndXByb2ZpbGUnOwogICAgdmFyIGRhdGEgPSBKU09OLnN0cmluZ2lmeShDUFVQ\ncm9maWxlLnByb2ZpbGUsIG51bGwsIDIpOwogICAgZnMud3JpdGVGaWxlU3lu\nYyhmaWxlLCBkYXRhKTsKICAgIGNvbnNvbGUubG9nKCdEb25lISBTZWUgJyAr\nIGZpbGUpOwp9CmBgYAojIyMjIEVuam95IQoKIFBsZWFzZSBmaWxlIGlzc3Vl\ncyBvciBQUiBhbnkgdXBkYXRlcyBhcyB5b3UgdHJ5IHRoaW5ncy4KCiMjIyMg\nV2h5PwoKVGVzdGluZyB0aGUgcGVyZm9ybWFuY2Ugb2YgYXN5bmNocm9ub3Vz\nIGNvZGUgaXMgZGlmZmljdWx0LiBPYnZpb3VzbHkgbWVhc3VyaW5nIGVuZFRp\nbWUgLSBzdGFydFRpbWUgZG9lc24ndCB3b3JrLiBVc2luZyBhIHByb2ZpbGVy\nIGdpdmVzIHlvdSB0aGUgaW5zaWdodCBvZiBob3cgbWFueSBtaWNyb3NlY29u\nZHMgdGhlIENQVSBzcGVudCB3aXRoaW4gZWFjaCBzY3JpcHQsIGZ1bmN0aW9u\nIGFuZCBpdHMgY2hpbGRyZW4uIEZvciBhc3luYyB1c2VjYXNlcywgaW4gcGFy\ndGljdWxhciwgeW91IGNhbiBub3cgZXZhbHVhdGUgZGlmZmVyZW5jZXMgbXVj\naCBlYXNpZXIuCgojIyMgQ29udHJpYnV0b3JzCiogcGF1bCBpcmlzaAoqIFtA\ndmxhZGlrb2ZmXShodHRwOi8vZ2l0aHViLmNvbS92bGFkaWtvZmYpIAo=\n",
            "encoding": "base64",
            "_links": {
                "self": "https://api.github.com/repos/paulirish/automated-chrome-profiling/contents/readme.md?ref=master",
                "git": "https://api.github.com/repos/paulirish/automated-chrome-profiling/git/blobs/f735013f30cbaed0103e49a52ee829c2cc09ad12",
                "html": "https://github.com/paulirish/automated-chrome-profiling/blob/master/readme.md"
            },
            "meta": {
                "x-ratelimit-limit": "5000",
                "x-ratelimit-remaining": "4937",
                "x-ratelimit-reset": "1421939621",
                "last-modified": "Thu, 22 Jan 2015 02:34:06 GMT",
                "etag": "\"c5f26954349ad7b12832972fc928e195\"",
                "status": "200 OK"
            },
            "infos": {
                "bolds": [],
                "codes": [],
                "headings": [
                    " Let's profile!",
                    " Code",
                    " Enjoy!",
                    " Why?",
                    " Contributors"
                ],
                "italics": [],
                "references": [
                    {
                        "title": "Chrome debugging protocol",
                        "href": "https://developer.chrome.com/devtools/docs/debugger-protocol",
                        "image": false
                    },
                    {
                        "title": "chrome-remote-interface",
                        "href": "https://github.com/cyrus-and/chrome-remote-interface",
                        "image": false
                    },
                    {
                        "title": "",
                        "href": "http://i.imgur.com/zAZa3iU.jpg",
                        "image": true
                    }
                ],
                "lists": [
                    [
                        "Open http://localhost:8080/perf-test.html",
                        "Start profiling",
                        "run `startTest"
                    ],
                    [
                        "Stop profiling and retrieve the profiling result",
                        "Load the data into Chrome DevTools"
                    ],
                    [
                        "paul irish"
                    ]
                ],
                "listsOrdered": [],
                "sections": [],
                "strikethroughs": [],
                "tasks": []
            }
        }
    }]);
})

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

server.listen(process.env.PORT);

console.log('Express server started on port %s', process.env.PORT);