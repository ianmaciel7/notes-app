export function createLocaleLangScript(
  locales: readonly string[],
  defaultLocale: string,
): string {
  // Mirrors resolveClientLocale(): exact supported cookie, then browser
  // languages (exact or primary language), then navigator.language, then default.
  return `(function(){var l=${JSON.stringify(locales)};var d=${JSON.stringify(defaultLocale)};var e=document.documentElement;try{var p=function(t){if(!t)return;var n=t.trim().toLowerCase();var m=l.find(function(x){return x.toLowerCase()===n});if(m)return m;var b=n.split("-")[0];return l.find(function(x){return x.toLowerCase().split("-")[0]===b})};var a;var c=document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);if(c){try{var v=decodeURIComponent(c[1]);if(l.indexOf(v)>-1)a=v}catch(x){}}if(!a){var q=(navigator.languages||[]).concat(navigator.language||[]);for(var i=0;i<q.length&&!a;i++)a=p(q[i])}e.lang=a||d}catch(x){e.lang=d}})()`;
}
