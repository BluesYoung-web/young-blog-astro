---
title: 滑动窗口算法
description: 滑动窗口算法
date: 2022-05-01 09:30:00
image: /img/algorithm.webp
---

[[toc]]

## 最小覆盖字串

[详见](../../notebook/js/Quick-Slow-Pointer#最小覆盖子串)

## 字符串的排列

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-567. 字符串的排列](https://leetcode-cn.com/problems/permutation-in-string/)

给定两个字符串 `s1` 和 `s2`，实现一个函数来判断 `s2` 是否包含 `s1` 的排列，如果存在则返回 `true`，否则返回 `false`


**提示：**
- s1, s2 仅包含小写字母
- s1.length ∈ [1, 1e4]
- s2.length ∈ [1, 1e4]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('字符串的排列', () => {
  it('1', () => {
    const s1 = 'ab';
    const s2 = 'eidbaooo';
    expect(checkInclusion(s1, s2)).toBe(true);
  });

  it('2', () => {
    const s1 = 'ab';
    const s2 = 'eidboaoo';
    expect(checkInclusion(s1, s2)).toBe(false);
  });

  it('3. 超时', () => {
    const s1 = `voujinkwlkydjrmbehskvlulpwmdczrzefahwvyakbzjvawxzhqztqswqghubeqhzyuyufiwxqxtyefgxteihyprxbwdykssxadcybtcverkzifjlheqwnpfeckywhusbmqktjhjjsodaqzdsghhaysoilhlqfbgobbwztiouplfeborkkqpqrrcizyazsttjjyaonwsqcbmmafafsvqofypdxcxsjqufxpxokkqftvneezbpidaqdwiprzztzlhdnyxjzpfplrwksetmdjsoskolwammzedrgwbttgjiznopuuwbqqwlyhrpzrapujnyufljiuwjaanikjsfaohejygudydnlaiczmokjqzkxxdsaexxlddypwgfopyruqvfvawqhxvwwmkiekvkkmojunjzxwiqkigohuwtlqhotzrbhpbvxpczmsqjlhmwbfyzlhlpjeawcxkracgjqmcdmtbzvssvgnuhwroxgoihlgbaxmmakzxxsyvscycylsbaaemmsrifqfcssdhzguueblxomruathvmybhgenytgddikaaogkwssdibperbodtlerrnkrdqicgnzwfxaoeqmfovjfetzrvpcsgpeeytxpbtefkwjgmuydmebhxwafemwlncgkwayljyatmmanmpfakwdnmvjqppuknagllcoyixpykxmvykfrfrwmiitxwvzwgiikzwhyhekgsyqivdizzpemotanlmtofjlcilwntqwwumgamtwszhfwcicqeqbxlpaotqfrgbehfcooooreeztiznxevlnkhqhtoeabvuzaxyslvtvelysgashucyvocysscbacshieepypttkkgbyebsrlbyrbsdadnunzzkwbyzspxucoblwmkmtnsatssazxwivfzwifiecrwofdbcaazxdofglusktgrjivedhokzdvdhtreingnglymhujlxrakfesmtemxildrpxazibxxndxctkpvupwisazhbkitwmbejzhzvafhtaisvjjvzyivmdghrmduheifbvwwjypbcxflesxswzybfaauzklcmjfzvcwulzemnaozqvprubrdzotggqkbwfjbsiyacsqyrnqdthyhemowcbxdapfuoohskvnyjehjzvyrzgkjeenfxurfalblwaklfevbgeiniihdcgaskpaqkxakrxwtklffhfvgoetfxuvpjtstdhcuithgsgdtqwuqbwjdjxctttmfrhkliyaylsdvwzyrtwenotyfourzhkqidkzmoqfbpwnodcyjnsbksbqymnvuvudsqwfnykavdpnyszbwofjxdjfhihztefusfvjcrgmoehigqsqhhkfcaumjgxzjhinydrbgapdrnzxcljdjzlwfliwhbcvoajviehzpdvxvigvaxtlctrtsctcaizxghlukazxjahjpmhwbcdcqdmvdadsluekbwwhzxrqwopdcecvpryeljmwzjotlapnunnpslbkehezwztlcauadepikdljsunxisiajtiqtdazgtizxmnilfrvhmyojdddxzsuzfychpysdsicakzctydwuwfkehxnfijhnwvwxaundogctgqcuuqpbetoqhwvgrqslrlvtlqvzuqmllvcpuikqrqfivfcfjvfohzfmvkyqbcahaarcyacidsfdobrbgclxkuijwdaaxpdtjbzudxegdijfecmmobkqeioogpthtdpvuzjqciiyfikvgzbpozxpksgnfgmrfqqcufjuangtaayzrqnhhgcxrjgroqltxwzammhoxfcykalbsutmwptspfcriqbhsxhjjhqyayquztgpsjvxbctfzskvqnsaiprqqtfzlelkgthqfpbwyjxiddryedqejhjrmzadkzdcpcekvuyyvhwqgadsgrdvukdypufnotfutbnnvfntzqgglgbfxtbhzczzfhcyvfidpcpchysdbzoeodexitmbuksjbyffpxgvpwfpqkeccxpjweokjpxvtsutezxyqpbsxekeacpxqbuhjcbrmprgisuuxoxehopkhmaqojxvodzblpiegmjtrhbijhvrogimhdfzoxpnofyujwqqzarheceiiirmuflxhcfjxqmadisviqjfzkmccnydksegmnwfdxxbngudcwthnbhockycjnzolwpxfkljmffqjoljsqcorbciunavkgfubnjamqspijnoabmyjlrtkefaiceufpffvwnygcxwrthyqerjedqyvpwtezyrvojztrxcxqqywebiqxcmnzuavbnpdyigtsyeojvubqhvetoocfifxqqczmnhmbxcxoxfdmjopbalqrivjkcayonnolylghzkajbxnxzwmnfsszryatbdhlhmoobxkxrwiwuezhujdpvqhohuevcmmjufkbzqriivpxvgvvjyvaipoewijpptjgpzsetuywcnfljssallxikayhjrjyedrlyboracgykaooieezeeubbrzsvuovdprsjifpihmuwwrgjhufsdwwbhhrloolxencdaiwhwrmsaqyamuwmicdzoisnydtfnzwrwpbpwbxzmmtxtxufolxchlealeslcyiweakaoysvijfzmninpmbzeazbjvdyojoyalopdmpdstsymgksuacwsppdmnkiluwoqylyedzzsyhgpxfwyaldfabbstonesihlypcouswkfcywnrggzzkamrtedxyzivuystgiuospvywhqqezjcbnhwzvsoqsbcvccsdhakxcbffrimyiuobwszvccwcdmzknqkicshubettbrvutlhhheuqyjblhvrbabwresreuuzwaeqgaflvcbjmzbenfoekgigcgxawvgnhofkoibvapouamuywgxhivfcchfqiecpltnnebwhgenmnujcrotnrzzrntsrceqaubpcqggoqkzvqnyigbwotnxgehpvcioyevbfqbqodkjsxrkoseytzhhzdymdftgsssibzroetdvhlxsfvqnqwhtyeldmjqdpctdzxkgqkcfmsxanilktehbwcwtaixi`;
    const s2 = `oqupbcqazvlehlzjyamwlmpybilihvokonzhgqiyomtdxcfcjrvyvzbftvxhcntsavnfumzzozxwpzllomceexaxmablfcluylwwgxzzcrfbusucsdaqlfztvxbwyaygucnowcvvwukhghyzbbwmgvdtcqdvwgulezccmcdmkkftwzodzpnmxxkgmlclgitebyjmferxpnerphcvpvrypnyhvnazizzrmqlpjgkoucmyqdzbwpewgduarfrulybyrokbztghpxojkxespppqpqgnnxacqtzebeogoswbwitciuvqdrlpohhfsgsjhbtgxlegvkovpzdjabojfojubbuabdagjppdtuaevynopbeawkyfevuutdczkxwkkvuiabnkgnscyquirognkzkeeelfmjyljljiozzswkkcxqsajbitjscsnrdzpiuaatkvbfhufaowbdmtydklapdbwlxvxfmoagutecttrbdogxhlrzxbtqqnyzludvwenlrbqehfjkgkcbtnknxcpexgyrkjvfdygoyfzjlceirvhlqrxjgrqxwezwhgnhkrisazhwhzhqdywuorxgmnhbippzuvbarblpbnwznvwnwhmxotwxeadpdcpjelkxopwmizuqctxhoxxrdyaxbvzhrcdtsaaxzehxroqupdigxzdrpbkztvxpnjbnscxvcqxkgfaocyhjqkyxwyogbeoekjepufascoyohlbebqypwvfgvwynfwcpoazzowvbvawvrxovsebibgcuiegpclatcxfiydvpxbolcmwlmwsvryaicjdirggfqykoezcrvzcgcnppdswmxjizjxgvxsitnwbhpfhpvcnliaofdfpwiwylrlaawqljqzpgymhhoygtieqnmujcacvxgzawjvofxsohkmoahshwmgwdarcgbginnrtfekniliwkqxbobcwusprjgasjbppiofeexhgiuxcbhysqpmacufvzjcpbxpdldbvtwpszpwaabqbrhwuczdluybcaelvuhurjwoblkoclsnqpjosgivwiynczedalhpksdibfvuhzcolormvxsbeokfvsbogoubdtzrupvehtdqmewxddjmlnsikxfxudmjqcqhsxlfcxqmgzafpszejwunccnrqmlnuumlxemmrvluioeaqspsvfrbyjjcmlvchjhcvyqzoeqobjeinxdzzwiyinmirkzqndcpmmjpejujfgtcftmccsoarfxvjtdczpvfbgluqvpynqtqmsfpngqeyiimseuldmnjnnwtpuwyggdlybuvpoxfyayhovxzhtlbmsldorjckmywsmigdocgbpbysjrpnxpzafxvbzciasldrtbjsiygspavhalsdvecanlmcmihcmyebtciayyvugavrpcvnjernmaqxusslswgrqauuerjbswsppvsbyffltivkoqkacscyryboknnhbstpmffhvnbznevcmolwvsusmowvybevlyksceaokcnymmgfmmetsacabcsinnqltrxsdnqfseaziyvbecfbacwqimrdgrdwpxrsusmwnervyedswloinjzxfphuvtkvujknlizsxgqoiotniuflvufiftskingufhgvqewvjqbhpyuhgzidoloeibxzwagkpffzotyprkmzajvuahrevwuanmzrqiaoedmdiaghxuslncxunbudftxwipuzihldhcjndwtzqirbwjpqqpckxaweteotuoqtxjsrfzdbwriihvbtnlbtttlnvivfyhetdlvrkqvjqscclmaifqqrgkcegwpzffhfywfaireqazvtkqinfnkzzdhdxdjjnpzyqowacsjhmfrnowekxhnoesupsnatiivxtjphzdonrbvbyrlljyjwyjqkndvskaffacxzcwyfgnpgbrxyqpnwjwvixnjvjykagehbsyxwjvvtlhhxjtqejinhiuejjvnbomyolslaacwcnasyavbcvpiqjldhqenlsmesoauvwekeooaqtlfgtyfgettakefpeknxwmgpxpkkmksfdvrgofgnwgsgadnjwmaltbguxgkajsukrujbrgzpdqxgehheqgniwxvlzdpnmvffxtoiznttsspvrufkkpfhlyenaotplkkfwvojtjnyzitnhnebwthecknkpeevctgtxbbbmmrxdzyeuatgctejpnuljsuoosqhdtpmcbhpmzzbdvhphvurbvurfjbtcoxenxprlodvqgyyooougpnyqqcsauflkbzyatregubqyeemntuilwfbcozptqwszgaueuomxhhrotdqeelblnbmwmhfdbqvtalgfwcxlruqjuxjepurpqkwuxnlajjrfnugtexgdiyxocfeqrmlrrfggbxywbrrmhrablneshhdpxpggkmzfnwdcrkrybzwxngplkvftxjgxfgiuuomvusihtndwmfxialvoujinkwlkydjrmbehskvlulppmdczrzefahwvyakbzjvawxzhqztqswqghubeqhzyuyufiwxmxtyefgxteihyprxbwdykssxadcybtcverkzifjlheqwnpfeckywhusbmqktjhjjsodaqzdsghhaysoilhlqfbgobbwztiouplfeborkkqpqrrcizyazsnmjjyaonwsqcbmmafafsvqofypdxcxsjqufxpxokkqftvneezbpidaqdwiprzztzlhdnyxjzpfplrwksetmdjsoskolwammzedrgwbttgjiznopuuwbqqwlyhrpzrapujnyufljiuwjaanikjsfaohejygudydnlaiczmokjqzkxxdsaexxlddypwgfopyauqvfvawqhxvwwmkiekvkkmojunjzxwiqkigohuwtlqhotzrbhpbvxpczmsqjlhmwbfyzlhlpjeawcxkracgjqmcdmtbzvssvgnuhwroxgoihlgbaxmmakzxxsyvscycylsbaaemmsrifqfcssdhzguueblxomruathvmybhgenytgddikaaogkwssdibperbodtberrnkrdqicgnzwfxaoaqmfovjfetzrvpcsgpeeytxpbtefkwjgmuydmebhxwafemwlncgkwayljaatmmanmpfekwdtmvjqppuknagllcoyixpykxmvykfrfrwmiitxwvzwgiikzwhyhekgsyqivdizzwemotanlmtofjlcilwntqwwumgamtwszhfwcicqeqbxlpaotqfrgbehfcooooteeztiznxevlnkhqhtoerbvuzaxyslvtvelysgashucyvocysscbacshieepypttkkgbyebsrlbyrbsdadnunzzkwbyzspxecoblwmkmtnsatssazxwivfzwifiucrwofdbcaazxdofglusktgrjivedhokzdvdhtreingnglymhujlxrakfesmtetxildrpxazibxxndxctkpvuzwisazhbkitwmbejzhzvafhtaisvjjvzyivmdghrmduheifbvwwjypbcxflesxswzybfayuzklcmjfzvcwuazemnaozqvprubrdzotggqkbwfjbsiyacsqyrnqdthyhemowcbxdapfuoohskvnyjehjzvyrzskjeenfxurfalblwaklfevbgeiniihdcgaskpaqkxakrxwtklffhfvgoetfxuvpjrstdhcuithgsgdtqwuqbwjdjxctttmfrhkliyaylsdowzyrtwenotyfourzhkqidkzmoqfbpwnodcyjnsbksbqymnvuvudsqwfnykavdpnyszbwofjxdjfhihztefusfvjcrgmoehigqsqhhkfcauqjgxzjhinydrbgapdrnzxcljdjzlwfliwhbcvosjviehzpdvxvigvaxtlctrtsctcaizxghlukazxjahjpmhwbcdcqdmvdadsluekbwwhzxrqwopdcecvpryeljmwzjotlapnunnpslbkehepwztlcauadepikdljsunxisiajtiqtdazgtizxmnilfrvhmyojdddxzsuzfychpysdsiczkzctydwuwfkehxnfijhnwvwxaundogctgqcuuqpbewoqhwvgrqslrlvtlqvzuqmllvcpuikqrqdivfcfjvfohzfmvkyqbcahaarcyacidsfdobrbgclxkuijwdaaxpdtjbzudxegdijfecmmobbqeioogpthtdpvuzjqciiyfikvgzbpozxpksgnfgmrfqqcufjulngtaayzrqnhhgcxrjgroqltxwzammhoxfcykalbsutmwptspfcriqbhsxhjjhqyayquztgpsjvxbctfzskvqnsaiprqqtfzlelkgthqfpbwyjxiddryedqejhjrmzadkzdcpcekvuyyvhwqgadsgmdvukdypufnotfutlnnvfntzqzglgbfxtbhzczzfhcyvfidpcpchzsdbzoeodexitmbuksjbyffpxgvptfpqkeccxpjweokjpxvtsutezxyqpbsxekeacpxqbuhjcbrmprgisuuxoxehopkhmaqojxvodzblpiegmjtrhbijhvrogimhdfzoxpnofyujwqqzarheceiiirmuflxhcfjxqmadisviqjfzkmccnydksegmnwfdxxbngudcwthnbhockycjnzolwpxfkljmffqjoljsqcorbciunavkgfubnjamqspijnoabmyjlrtkefaiceufpffvwnygcxwrthyqerjedqyvpwtezyrvvjztrxcxqqywebiqbcmnzuavbnpdyigtsyeojvubqhvetoocfifxqqczmnhmbxcxoxfdmjopxalqrivjkcayonnolylghzkajbxnxzwmnfsszryatbdhlhmoobxkxrwiwuezhujdpvqhohuevcmmjufkbzqriivpxvgvvjyvaipoewijpptjgpzsetuywcnfljssallxikayhjrjyedrlyboracgykaooieegeeubbrzsvuovdprsjifpihmuwwrgjhufsdwwbhhrloolxencdaiwhwrmsaqyamuwmicdzoignydtfnzwrwpbpwbxzmmtxtxufolxchlealeslcyiweakaoysvijfzmninpmbzeazbjvdyojoyalopdmpdstsymgksuacwsppdmnkiluwoqylyedzzsyhgpxfwyaldfabbstonesihlypcouswkfcywnrggzzkamrtedxyzivuystgiuospvywhqqezjcbnhwyvsoqsbcvccadhakxcbffrimyiuobwszvccwcdmzknqkicshubettbrvutlhhheuqyjblhvrbabwresreuuzwaeqgaflvcbjmzbenfoekgigcgxawvgnhofkoikvapouamuywgxhivfcchfqiecpltnnebwhgenrnujcrotnrzzrntsrceqaubpcqggoqkzvqnyigbwotnxgehpvcioyevbfqbqodkjsxrkoseytzhhzdymfftgsssibaroetdvhlxsfvqnqwhtyeldmjqdpctdzxkgqkcfmsxanilktehbwcwtaixiefnhewlzmfeefpldmeptjjshxebbwrbmhrmybddxovkszadbyeqvrxncffozgozdrro`;
    expect(checkInclusion(s1, s2)).toBe(true);
  });
});
```
  
</details>

### 具体实现

```ts
function checkInclusion(s1: string, s2: string): boolean {
  if (s1 === s2) {
    return true;
  }
  const len1 = s1.length;
  const len2 = s2.length;
  if (len2 < len1) {
    return false;
  }

  const needs = new Map<string, number>();
  const win = new Map<string, number>();
  let matchNum = 0;
  let left = 0, right = 0;

  for (const s of s1) {
    const n = needs.get(s);
    if (n) {
      needs.set(s, n + 1);
    } else {
      needs.set(s, 1);
    }
  }

  while(right < len2) {
    const s = s2[right];
    right++;
    if (needs.has(s)) {
      if (win.has(s)) {
        win.set(s, win.get(s) + 1);
      } else {
        win.set(s, 1);
      }
      // 单个字符的数量匹配成功
      if (win.get(s) === needs.get(s)) {
        matchNum++;
      }
    }

    // 维持固定的窗口大小
    while (right - left >= len1) {
      if (matchNum === needs.size) {
        return true;
      }
      // 窗口中存在冗余元素，需要收缩窗口
      const s = s2[left];
      left++;
      if (needs.has(s)) {
        if (needs.get(s) === win.get(s)) {
          matchNum--;
        }
        win.set(s, win.get(s) - 1);
      }
    }
  }
  return false;
};
```

## 找到字符串中所有字母的异位词

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-438. 找到字符串中所有字母异位词](https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/)

给定两个字符串 `s` 和 `p`，找到 `s` 中所有 `p` 的**异位词**的子串，返回这些子串的起始索引，不用考虑顺序

**提示：**
- s, p 仅包含小写字母
- s.length ∈ [1, 3e4]
- p.length ∈ [1, 3e4]

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

import { describe, expect, it } from 'vitest'

describe('找到字母的异位词', () => {
  it('1', () => {
    const srcStr = 'cbaebabacd';
    const targetStr = 'abc';
    expect(findAnagrams(srcStr, targetStr)).toEqual([0, 6]);
  });

  it('2', () => {
    const srcStr = 'abab';
    const targetStr = 'ab';
    expect(findAnagrams(srcStr, targetStr)).toEqual([0, 1, 2]);
  });
});
```
  
</details>

### 具体实现

将上面一题稍作调整即可

```ts
function findAnagrams(srcStr: string, targetStr: string): number[] {
  if (srcStr === targetStr) {
    return [0];
  }
  const len1 = srcStr.length;
  const len2 = targetStr.length;
  const res = [];
  if (len2 > len1) {
    return res;
  }

  const needs = new Map<string, number>();
  const win = new Map<string, number>();
  let matchNum = 0;
  let left = 0, right = 0;

  for (const s of targetStr) {
    const n = needs.get(s);
    if (n) {
      needs.set(s, n + 1);
    } else {
      needs.set(s, 1);
    }
  }

  while(right < len1) {
    const s = srcStr[right];
    right++;
    if (needs.has(s)) {
      if (win.has(s)) {
        win.set(s, win.get(s) + 1);
      } else {
        win.set(s, 1);
      }
      // 单个字符的数量匹配成功
      if (win.get(s) === needs.get(s)) {
        matchNum++;
      }
    }

    // 维持固定的窗口大小
    while (right - left >= len2) {
      if (matchNum === needs.size) {
        res.push(left);
      }
      // 窗口中存在冗余元素，需要收缩窗口
      const s = srcStr[left];
      left++;
      if (needs.has(s)) {
        if (needs.get(s) === win.get(s)) {
          matchNum--;
        }
        win.set(s, win.get(s) - 1);
      }
    }
  }
  return res;
};
```

## 无重复字符的最长子串

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

给定一个字符串 `s`，请你找出其中不含有重复字符的**最长字串**的长度

**提示：**
- s.length ∈ [0, 5e4]
- s 由英文字母、数字、符号和空格组成

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="i-vscode-icons-file-type-testts mr-1"></div>
    测试代码
  </summary>

```ts
import { describe, expect, it } from 'vitest'

describe('无重复最长字串', () => {
  it('1', () => {
    const s = 'abcabcbb';
    expect(lengthOfLongestSubstring(s)).toBe(3);
  });

  it('2', () => {
    const s = 'bbbbb';
    expect(lengthOfLongestSubstring(s)).toBe(1);
  });

  it('3', () => {
    const s = 'pwwkew';
    expect(lengthOfLongestSubstring(s)).toBe(3);
  });
});
```
  
</details>

### 具体实现

```ts
function lengthOfLongestSubstring(s: string): number {
  const len = s.length;
  let max = 0;
  let left = 0, right = 0;

  const map: Record<string, number> = {};
  while (right < len) {
    let char = s[right];
    if (map[char]) {
      map[char]++;
    } else {
      map[char] = 1;
    }
    right++;
    while (map[char] > 1) {
      let lchar = s[left];
      map[lchar]--;
      left++;
    }
    max = Math.max(max, right - left);
  }
  return max;
}
```

[another](../../notebook/js/Quick-Slow-Pointer#无重复最长子串)