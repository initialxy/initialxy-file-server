# initialxy-file-server
Yet another Raspberry Pi project of mine. This is a personal project, **not meant for production usages**. This project serves as an intentionally minimal file server that allows you to browse file directories starting from a sub directory. It is meant to be engaging, colorful and easy to use for kids.

The reason why I'm creating this at all is because I got a Amazon Fire tablet for my daughter during the 2020 lockdown. While I like FreeTime, which is their kids UI, for whatever reason you can't put Amazon Prime free videos on it. You can watch them in the normal UI. You can put videos that you bought on FreeTime. But not Prime free videos. FreeTime does allow you to allowlist URLs to be opned in browser. Hence the inception of this project.

# Technial background
One might ask, there are already tons of open source file servers out there. Why reinvent the wheel? As a matter of fact, I did put [Nextcloud](https://github.com/nextcloud) on my Raspberry Pi 3 and it works. But it's choking both the Raspberry Pi as well as Amazon Fire. Furthermore, its UI is much more advanced, and certainly not kids friendly. This project is meant to be light weight and intentionally minimal. I took this opportunity to update myself on Python 3.8 and Vue 3.0. It's a fun learning experience for me.

Like I mentioned, this project serves as a learning tool for me. So like my other projects, its technical choices are intentionally quirkly. The theme for this project is to achive near complete type safety across the entire web stack. As someone who works on an astronomical monolithic code base at a major tech company, static time error checks are a must-have for scaling a code base. The challenge of this project is to accomplish type safety across Python and JavaScript, two extremely popular languages that's traditionally been used with weak typing. With the advance of Python 3.5 and TypeScript, type safety is now possible. Using tools like Thrift, type safety across languages is also achivable. Furthermore, Vue 3.0 added much better support for TypeScript. Hence I intentionally picked Python on server side and Vue + TypeScript on client side as a proof-of-concept to see how far the whole stack can be checked in static time.

# Build and run
I don't even know man. I'm still coding it out.

# License
MIT