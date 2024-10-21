// 游戏规则

export default {
  rules: {
    Rule: 'Game rules',
    Tip: 'Please carefully understand the rules of the game "the rules of the game are as follows"',
    OpenTime: 'The betting time of this game, Beijing time (GMT+8) every day from 00:01 am to 23:59 pm, 1440 periods a day',
    OpenTime1: 'The betting time of this game, Beijing time (GMT+8) every day from 00:02 am to 23:59 pm, 720 periods a day',
    OpenTime2: 'The betting time of this game, Beijing time (GMT+8) every day from 00:05 am to 23:59 pm, 288 periods a day',
    OpenTime3: 'The betting time of this game, Beijing time (GMT+8) every day from 00:01 am to 23:59 pm, 480 periods a day',
    fg11x5: 'The betting time of this game, Beijing time (GMT+8) every day from 00:02 in the morning to 23:59 in the evening, 720 periods a day',
    jd11x5: 'The betting time of this game, Beijing time (GMT+8) every day from 00:01 in the morning to 23:59 in the evening, 1440 periods a day',
    gd11x5: 'There are a total of five balls drawn in Guangdong Eleventh Five. Beijing time (GMT+8) every day from 09:10 am to 23:10 pm, every 20 minutes, and 42 prizes are drawn every day.',
    jx11x5: 'In each period of Jiangxi Eleven Selection Five, there are a total of five balls drawn. Beijing time (GMT+8) opens every day from 09:10 am to 23:10 at night. The prize is drawn every 20 minutes, and there are 42 prizes drawn every day.',
    sh11x5: 'There are a total of five balls in each session of the Shanghai Eleven Selection Five. Beijing time (GMT+8) opens every day from 09:00 am to 2:00 pm during the day. The prize is drawn every 20 minutes, and 45 draws are drawn every day.',
    ln11x5: 'There are a total of five balls in the Liaoning Eleventh Select Five Lottery. Beijing time (GMT+8) every day from 08:49 am to 22:29 pm during the day, every 20 minutes, there are 41 draws every day.',
    hb11x5: 'There are a total of five winning balls in each phase of the five prizes for the five prizes of Hubei Eleventh Selection. Beijing time (GMT+8) opens every day from 08:35 am to 21:55 pm, every 20 minutes, and 40 prizes are drawn every day.',
    js11x5: 'The betting time of this game is Beijing time (GMT+8) every day from 08:45 am to 21:45 at night, with prizes drawn every 20 minutes, with 40 prizes drawn every day.',
    c11x5wfc: 'The betting time of this game, Beijing time (GMT+8) every day from 00:05 am to 23:59 pm, 288 periods a day',
    c11x5efc: 'The betting time of this game, Beijing time (GMT+8) every day from 00:02 in the morning to 23:59 in the evening, 720 periods a day',
    ffpk10: 'The betting time of this game, Beijing time (GMT+8) every day from 00:01 in the morning to 23:59 in the evening, 1440 periods a day',
    wfpk10: 'The betting time of this game, Beijing time (GMT+8) every day from 00:05 am to 23:59 pm, 288 periods a day',
    azpk10: 'The betting time of this game, Beijing time (GMT+8) every day from 00:05 am to 23:59 pm, 288 periods a day',
    cqssc: 'The game betting time, Beijing time (GMT+8) every day from 07:10 in the morning to 3:10 in the morning, note: the 10th period starts at 7:10 in the morning to the 59th period at 23:50, (cross-day) The first period from 0:10 to the end of the ninth period at 3:10 am, the prizes will be drawn every 20 minutes, and a total of 59 prizes will be drawn.',
    xjssc: 'The game betting time, Beijing time (GMT+8) every day during the day from 10:20 in the morning to the end of 02:00 in the morning, 48 times a day.',
    ynssc: 'The betting time of this game is Beijing time (GMT+8) every day from 09:30 am to 21:30 at night, with prizes drawn every 20 minutes, and there are 36 prizes drawn every day.',
    xxlssc: 'The betting time of this game, Beijing time (GMT+8) every day from 00:01 in the morning to 23:59 in the evening, 1440 periods a day',
    vnsssc: 'The betting time of this game, Beijing time (GMT+8) every day from 00:01 in the morning to 23:59 in the evening, 1440 periods a day',
    vnssc: 'The betting time of this game, Beijing time (GMT+8) every day from 00:01 in the morning to 23:59 in the evening, 1440 periods a day',
    gdklsf: 'There are a total of eight balls in each session. In addition to the sum play method, each ball has a separate betting page. The betting time of this game is Beijing time (GMT+8) every day from 09:01 in the morning to 23:01 in the evening, with prizes drawn every 20 minutes, and there are 42 prizes drawn every day.',
    klsfwfc: 'The betting time of this game, Beijing time (GMT+8) every day from 00:05 am to 23:59 pm, 288 periods a day',
    klsfefc: 'The betting time of this game, Beijing time (GMT+8) every day from 00:02 in the morning to 23:59 in the evening, 720 periods a day',

    RuleText: '<p><strong>Note: If the three dice have the same number of points in the plane, take all the bets of "big", "small", "single" and "double"</strong></p><div><div><h3>◎Sum</h3>' +
      '<p class="ml25"><strong> Odd and even size:</strong>' +
      'Judging by the sum of all three numbers drawn. Size: The total value of the three lottery numbers 11~17 is large, and the total value of 4-10 is small;' +
      ' Odd and even: The total value of the three lottery numbers is single, and the odd is the winning; Note: If the three numbers are the same, both Does not count as winning (for losing).</p>' +
      '<p class="ml25"><strong>Points:</strong> When the total value of the winning numbers is 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, or 17, it is a winning; if 3, 18 is drawn, it is not counted Winning.</p>' +
      '<p class="ml25">※Example: If the winning numbers are 1, 2, 3, and the total value is 6, betting on "6" is the winning. "</p></div><div><h3>◎Order number</h3>' +
      '<p class="ml25">When one of the three lottery numbers is the same as the selected number, the prize is won.</p>' +
      '<p class="ml25">※Example: If the winning numbers are 1, 1, 3, betting slip number 1 or slip number 3 will be regarded as winning.</p>' +
      '<p class="ml25">※Note: No matter how many times the points specified by the authorities appear, the prize will be paid only once (not doubled).</p></div><div><h3>◎Three same numbers</h3>' +
      '<p class="ml25"> Round dice: If the three-character numbers are the same and match the selected round dice combination, it is a win.</p>' +
      '<p class="ml25"> Full dice: If all dice combinations are selected, the winning number is the same.</p></div><div><h3>◎Two different numbers</h3>' +
      '<p class="ml25"> You can choose one or two different combinations. When any 2 digits of the lottery result are the same as the selected combination, it is a winner.</p>' +
      '<p class="ml25"> ※Example: If the winning numbers are 1, 2, 3, betting on two different numbers 12, two different numbers 23, and two different numbers 13 will all be regarded as winning.</p></div><div><h3>◎Two same numbers</h3>' +
      '<p class="ml25"> When the flat points of two dice are selected and match the selected combination of two same numbers, it is a win.</p><p class="ml25">※Example: If the winning numbers are 1, 1, 3, betting on the same number 1 and 1 is the winning.</p>' +
      '<h3>◎Three consecutive numbers</h3><p class="ml25"> If the number of points on the three dice matches the selected combination of three consecutive numbers, the prize is won.</p> ' +
      '<p class="ml25">※Example: If the winning numbers are 1, 2, 3 or 1, 3, 2 or 2, 1, 3 or 2, 3, 1 or 3, 1, 2 or 3, 2, 1, then bet on three consecutive numbers 1. 2, 3 is the winning.</p><h3>◎Three different numbers</h3>' +
      '<p class="ml25"> "Three different numbers" between one and six points, the three dice plane points are not the same; choose 3 unique points from a total of 6 points from 1-6 to form 1 bet, the selected points are the same as all the points drawn in the current period , The order is not limited to be regarded as winning.</p> ' +
      '<p class="ml25">※Example: For example: lottery result, 1,3,5, bet 1,3,5 to win, bet, 1,3,4 not to win. "</p></div></div>',
    SumValue: 'sum value',
    OrderNumber: 'Single number',
    ThreeSameNumbers: 'Three Same Number',
    TwoDifferentNumbers: 'Two Different Number',
    TwoSameNumbers: 'Two Same Number',
    ThreeConsecutiveNumbers: 'Three Consecutive Number',
    ThreeDifferentNumbers: 'Three Different Number',

    c11x5_kuaijie: 'Quick',
    c11x5_zx: 'Direct Selection',
    c11x5_zux: 'Select Group',
    c11x5_rx: 'Any Selection',
    c11x5_one_ball: 'First Bet',
    c11x5_two_ball: 'Second Bet',
    c11x5_three_ball: 'The Third',
    c11x5_four_ball: 'The Fourth',
    c11x5_five_ball: 'The Fifth',
    c11x5_lm: 'Sum - Dragon Tiger',
    c11x5_zh: 'Sum',
    c11x5_zh_wei_big: 'Sum of last digits big',
    c11x5_zh_wei_small: 'Sum of last digits small ',
    c11x5_zh_wei_odd: 'Sum of last digits odd',
    c11x5_zh_wei_even: 'Sum of last digits even',
    c11x5_big: 'Big',
    c11x5_small: 'Small',
    c11x5_odd: 'Odd',
    c11x5_even: 'Even',
    c11x5_tiger: 'Tiger',
    c11x5_dragon: 'Dragon',
    c11x5_zh_big: 'SumBig',
    c11x5_zh_small: 'SumSmall',
    c11x5_zh_odd: 'SumOdd',
    c11x5_zh_even: 'SumEven',
    c11x5_big_small: 'Big Small',
    c11x5_odd_even: 'Odd Even',
    c11x5_dragon_tiger: 'Dragon Tiger',
    c11x5_w_first: 'Ten thousand the first',
    c11x5_b_two: 'Thousand the second',
    c11x5_q_three: 'Hundred the third',
    c11x5_s_four: 'Ten the fourth',
    c11x5_g_five: 'Units the fifth',
    c11x5_zh_lh: 'Sum/Dragon Tiger',

    c11x5_one_in_one: 'One in one',
    c11x5_two_in_two: 'Two in two',
    c11x5_three_in_three: 'Three in three',
    c11x5_four_in_four: 'Four in four',
    c11x5_five_in_five: 'Five in five',
    c11x5_six_in_five: 'Six in Five',
    c11x5_seven_in_five: 'Seven in five',
    c11x5_eight_in_five: 'Eight in five',
    c11x5_first_two_digits: 'The First two Digits',
    c11x5_first_three_digits: 'The First Three Digits',
    c11x5_gy_big: 'Champion and Runner-up big',
    c11x5_gy_small: 'Champion and Runner-up small',
    c11x5_gy_odd: 'Champion and Runner-up odd',
    c11x5_gy_even: 'Champion and Runner-up even',
    c11x5_gy_he: 'Champion and Runner-up',
    c11x5_gyj_he: 'Champion Runner-up third place',
    ssc_qzh: 'First middle last',

    ssc_draw: 'Draw',
    ssc_qsq: 'First three balls',
    ssc_zsq: 'Middle three balls',
    ssc_hsq: 'Last three balls',
    ssc_sh: 'Stud',
    ssc_dn: 'Bullfight',

    ssc_bao: 'Three of a kind',
    ssc_ban: 'half straight',
    ssc_shun: 'Straight  ',
    ssc_dui: 'Pair',
    ssc_za: 'Not straight  ',
    ssc_mei_niu: 'No cow',
    ssc_niu_niu: 'CowCow',
    ssc_niu_big: 'ฺBigCow',
    ssc_niu_small: 'SmallCow',
    ssc_niu_odd: 'OddCow',
    ssc_niu_even: 'EvenCow',
    ssc_niu: 'Cow',
    ssc_niu_1: 'Cow 1',
    ssc_niu_2: 'Cow 2',
    ssc_niu_3: 'Cow 3',
    ssc_niu_4: 'Cow 4',
    ssc_niu_5: 'Cow 5',
    ssc_niu_6: 'Cow 6',
    ssc_niu_7: 'Cow 7',
    ssc_niu_8: 'Cow 8',
    ssc_niu_9: 'Cow 9',
    ssc_wt: 'Straight Flush',
    ssc_sit: 'Four of a Kind',
    ssc_hl: 'Full house',
    ssc_sant: 'Three of a kind  ',
    ssc_lt: 'Two Pairs',
    ssc_yd: 'One pair',
    ssc_sz: 'Straight',
    ssc_san_hao: 'High card',

    pk10_champion: 'Champion ',
    pk10_runner_up: 'Runner-up',
    pk10_one_place: 'First place',
    pk10_two_place: 'Second place',
    pk10_third_place: 'Third place',
    pk10_fourth_place: 'Fourth place',
    pk10_fifth_place: 'Fifth place',
    pk10_sixth_place: 'Sixth place',
    pk10_seventh_place: 'Seventh place',
    pk10_eight_place: 'Eight place',
    pk10_ninth_place: 'Ninth place',
    pk10_tenth_place: 'Tenth place',
    pk10_dx: 'points',
    pk10_dxds: 'BigSmallOddEven',

    klsf_six_ball: 'The Sixth',
    klsf_seven_ball: 'The Seventh',
    klsf_eight_ball: 'The Eighth',
    klsf_nine_ball: 'Ninth ball',
    klsf_ten_ball: 'Tenth ball',
    klsf_zm: 'Positive Yards',
    klsf_sumsingle: 'Sum of odd numbers',
    klsf_sumdouble: 'Sum of even numbers',
    klsf_endbig: 'Last digits big ',
    klsf_endsmall: 'Last digits small',
    klsf_east: 'East',
    klsf_south: 'South',
    klsf_west: 'West',
    klsf_noth: 'North',
    klsf_center: 'Red',
    klsf_send: 'Green',
    klsf_white: 'White',
    klsf_sumendbig: 'Sum of last digits big',
    klsf_sumendsmall: 'Sum of last digits small',
    klsf_haoma: 'Number',
    klsf_liangmian: 'Two sides',

    c11x5_kjjl: 'Lottery record',
    c11x5_zz: 'Trend',
    c11x5_lmcl: 'Both sides long rows ',
    pk10_gyh: 'Champion and Runner-up',
    c11x5_lt: 'Type of Lottery',
    c11x5_play: 'How to play',
    c11x5_lo: 'Lottery result period',

    c11x5_rules: '<strong>Odd number：</strong>Refers to the sequence and number of each bet as the main payout. If the first bet is drawn as an 8, bets on the first bet being 8 will be  win. the 5th bet is drawn as a number 2, bets on the 5th bet are  2 will be win.  The remainder will be deemed unrewarded；<br>' +
      '<strong>Two Sides：</strong>Odd, Even, Big, Small, Sum of Odd, Even, Big, Small,  Sum of last digits Big and Small；' +
      '<p><mark>Odd and Even：</mark>from  The first to  The fifth The numbers drawn are even numbers, such as 8, 10, and the numbers drawn are odd, such as 3, 5 and 11, are sums (not counted win or lost)</p>' +
      '<p><mark>Big and small：</mark>from the first to the fifth. The number drawn is more than or equal to 6 will be big, if the drawn number is less than or equal to 5 it will be small and if the drawn number is 11 it will be a total (not counted win or loss).</p>' +
      '<p><mark>Sum of Odd and Even：</mark>If the sum of lotery results  all 5 numbers is odd, it will be sum of odd For example, the sum of the numbers is 11, 31；If the sum of lotery results  all 5 numbers is Even , it will be sum of Even；For example, the sum of the numbers 42 , 30.If the sum of the bets matches lotery result, it is win lottery . The remainder will be deemed unrewarded.</p>' +
      '<p><mark>Sum of Big and Small：</mark>If the sum of lotery results all 5 numbers is more than 30, it will be a Sum of Big. ；Sum of lotery results all 5 numbers less than 30 will be a Sum of small . If the sum is 30, it is a total  (not counted win or loss).</p>' +
      '<p><mark>Sum of the last digits, big, small：</mark>Single digit of the sum of all 5 prizes drawn, more than or equal to 5 will be the sum of the last digits  big and less than or equal to 4 will be the sum of the last digits small. If the sum of the bets matches lotery result, it is win lottery . The remainder will be deemed unrewarded.</p>' +
      '<p><mark>Sum of the last digits is odd, even. ：</mark>The last digit of the sum of all 5 prizes drawn is odd. It is called the sum of the last digits odd . If the last digit of the sum of all 5 winning numbers is even It is called the sum of the last digits even </p>' +
      '<strong>Dragon Tiger：</strong>The winning number of the first and the winning number of the fifth  are used as the winning numbers' +
      '<p><mark>Dragon ：</mark>The winning number of the first drawn is more than the winning number of the fifth . If the first is 10, the fifth is 7 ,the winning is the dragon</p>' +
      '<p><mark>Tiger ：</mark>The winning number of the first drawn is less than the winning number of the fifth . If the first  is 3, the fifth is 7 , the winner is the tiger.</p> ' +
      '<strong>Direct <selection></selection>：</strong>' +
      '<strong>Group selection：</strong>' +
      '<p><mark>Group selection  the first two digits：</mark>the 2 numbers bet are the same as the first 2 numbers of the 5 numbers drawn in the current (unordered list), it will be win lottery</p>' +
      '<p><mark>Group selection the first two digits：</mark>the 3 numbers bet are the same as the first 3 numbers of the 5 numbers drawn in the current (unordered list), it will be win lottery</p>' +
      '<strong>Any selection：</strong><p><mark>Optional one in one：</mark>betting on1 number is the same as any one of the 5 numbers drawn in the current draw, it will be win lottery</p>' +
      '<p><mark>Optional two in two：</mark>betting on 2 numbers that are the same as any 2 of the 5 numbers drawn in the current draw (unordered list), it will be win lottery</p>' +
      '<p><mark>Optional three in three：</mark>betting on 3 numbers that are the same as any 3 of the 5 numbers drawn in the current draw (unordered list), it will be win lottery</p>' +
      '<p><mark>Optional four in four：</mark>bet on 4 numbers that are the same as any 4 of the 5 numbers drawn in the current draw (unordered list), it will be win lottery</p>' +
      '<p><mark>Optional five in five：</mark>betting on 5 numbers that are the same as 5 of the 5 numbers in the current draw (unordered list),it will be win lottery</p>' +
      '<p><mark>Optional six in five：</mark>betting on any 5 of the 6 numbers is the same as the 5 numbers drawn in the current draw (unordered list), it will be win lottery</p>' +
      '<p><mark>Optional seven in five：</mark>betting on any 5 of the 7 numbers is the same as the 5 numbers drawn in the current draw (unordered list),it will be win lottery</p>' +
      '<p><mark>Optional eight in five：</mark>any 5 of the 8 numbers is the same as the 5 numbers drawn in the current draw (unordered list),it will be win lottery</p>',

    pk10_rules: '◎Single code / double-sided rule description' +
      '<h3>◎Position</h3>' +
      '<p class=ml25>Refers to the order of appearance and numbers of champion, runner-up, third runner-up, fourth, fifth, sixth, seventh, eighth, ninth, and tenth place as the basis for winning</p>' +
      '<p class=ml25>If the first lottery number is 3, the betting champion is 3, it will be deemed as a winner, and the other numbers will be deemed not.</p>' +
      '<h3>◎Big small</h3>' +
      '<p class=ml25>The result of the winning number drawn is more than or equal to 6 is Big and less than or equal to 5 is small.</p>' +
      '<h3>◎Even odd</h3>' +
      '<p class=ml25>Even numbers are called even numbers, for example 4, 6; Odd numbers are called odd, for example 3, 5.</p>' +
      '<h3>◎Dragon Tiger</h3>' +
      '<div class="clearfix play_playPrizeBox table">' +
      '<table>' +
      '<tr><td>Tiger Dragon Champion<td>* Dragon：The champion number more than the tenth place "Dragon" wins. For example, the champion number prize result is 07 and the tenth place number prize result is 03.。<br>* Tiger：The champion number less than the tenth place number is "Tiger" wins. For example, the champion number prize result is 03 and the tenth place number prize result is 07.' +
      '<tr><td>Runner-up Dragon Tiger<td>* Dragon：The runner-up number more than The ninth place is "Dragon" winning. For example, the runner-up number result is 07 and the ninth place prize result is 03<br>* Tiger：The runner-up number less than the ninth place is "Tiger" won. For example, the runner-up number 03 is 03 and the ninth place prize is 07.' +
      '<tr><td>Third place Dragon Tiger<td>* Dragon：The third-place number is greater than the eighth-placed number as a "dragon" winning. For example, the third-place winner is 07, and the eighth-place winner is 03.<br>* Tiger：The third runner-up number is less than the eighth runner-up number as a "tiger" winning, such as the third runner-up number 03 and the eighth runner-up number 07.' +
      '<tr><td>Fourth place Dragon Tiger<td>* Dragon：The fourth place number is greater than the seventh place as a "dragon" winner. If the fourth place draws 07, the seventh place draws 03.<br>* Tiger：The fourth place number is less than the seventh place number as a "tiger" winning. For example, the fourth place draws 03 and the seventh place draws 07.' +
      '<tr><td>Fifth place Dragon Tiger<td>* Dragon：The fifth-placed number is greater than the sixth-placed number as a "dragon" winning. If the fifth-placed number is 07, the sixth-placed number is 03.<br>* Tiger：The fifth place number is less than the sixth place as a "tiger" winner. If the fifth place draws 03, the sixth place draws 07.' +
      '</table>' +
      '</div>' +
      '<h3>◎Champion and Runner-up</h3>' +
      '<p class=ml25>The sum of the champion number and runner-up number is in the range of 3~19 when the combined bet matches the sum of the champion and runner-up number. will be deemed to have won</p>' +
      '<h3>◎Champion, Runner-up, Big and Small</h3>' +
      '<p class=ml25>When the sum of the championship number and the runner-up number is more than 11 is big, the "big" bet wins. If less than or equal to 11 is Small and the "Small" bet wins.</p>' +
      '<h3>◎Championship, Runner-up, Odd-Even</h3>' +
      '<p class=ml25>The sum of the championship numbers and the runners-up numbers.，The sum of the third placed numbers is odd, such as 9, 13, and the "odd" bet will be considered winning. It is an even number such as 12 and 16. The "even" bet wins.</p>' +
      '<h3>◎ Champion, Runner-up, Third Runner-up<</h3>' +
      '<p class=ml25>The sum of the champion number and runner-up number and third runner-up number is 6-27. All bets placed on the champion and the runner-up and third runner-up total will be win.</p>',
    klsf_rules: '<ul>' +
      '<p><strong class="F_bold">two sides：</strong>odd and even; Big, small, last digits big, last digits small, sum of odd and <even></even></p>' +
      '<p><strong>Odd and Even：</strong>Even numbers are called even, such as 8, 16, and odd numbers are called odd, such as 19, 5。</p>' +
      '<p><strong>Big and Small：</strong>The result of a random number more than or equal to 11 is big , less than or equal to 10 is considered small</p>' +
      '<p><strong>ast digits big and last digits small：</strong>The prize result for the number of last digits big drawn more than or equal to 5 is the last digits big and less than or equal to 4 for last digits small.</p>' +
      '<p><strong>Sum of odd and even：</strong>Units and Tens lottery results. If the resulting number is odd It will be an sum of odd , for example 05, 12 if the resulting number is even. will be an sum of even , for example 08, 19</p>' +
      '<p>Each number is a combination bet. If the bet number is a winning number and is in the position of the bet, the bet will be considered won. and in all other cases it will be deemed unrewarded.</p>' +
      '<h3>red green white</h3>' +
      '<p><strong>Red：</strong>The drawn numbers are 01, 02, 03, 04, 05, 06, 07.</p>' +
      '<p><strong>Green：</strong>The drawn numbers are 08, 09, 10, 11, 12, 13, 14.</p>' +
      '<p><strong>White：</strong>The drawn numbers are 15, 16, 17, 18, 19, 20.</p>' +
      '<h3>position</h3>' +
      '<p><strong>East：</strong>The drawn numbers are 01, 05, 09, 13, 17.</p>' +
      '<p><strong>South：</strong>The drawn numbers are 02, 06, 10, 14, 18.</p>' +
      '<p><strong>West：</strong>The drawn numbers are 03, 07, 11, 15, 19.</p>' +
      '<p><strong>North：</strong>The drawn numbers are 04, 08, 12, 16, 20.</p>' +
      '<p><span class="F_bold"><strong>Number Code：</strong></span>Choose any number from 01 to 20 to place a bet. If the bet number matches any of the winning numbers will be rewarded</p>',

    ssc_rules: '<h3>High frequency color</h3>' +
      '<div>' +
      '<h3>How to play Two-sided</h3>' +
      '<p class="ml25">If the result of the lottery is digit of a number tens thousands, thousands, hundreds, ten or each digit of a number is 1, 3, 5, 7, 9 is ""Odd""，if it is 0, 2, 4, 6, 8 it is ""Even"". When the odd and even number of bets matches the number of odd and even numbers in the lottery result, it will win lottery.</p>' +
      '<p class="ml25">※Example: Player bets on digit of a number hundreds and if the current prize result is 20130 (1 is odd), it will win lottery.</p>' +
      '</div>' +
      '<table class="play_dialog_table mce-item-table">' +
      '<tbody>' +
      '<tr>' +
      '<th>odd</th>' +
      '<th>even</th>' +
      '</tr>' +
      '<tr>' +
      '<td>1、 3、 5、 7、 9</td>' +
      '<td>0、 2、 4、 6、 8</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '<div>' +
      '<h3>◎Tips on how to play big and small</h3>' +
      '<p class="ml25">The lottery result is ""big"" when ten thousand, thousand, hundred, ten or one digit is 5, 6, 7, 8, 9 and ""small"" if 0, 1, 2, 3 , 4, when big and small of the bet amount matches big and small numbers in the lottery result. it will win lottery.</p>' +
      '<p class="ml25">※Example: The player bets on the small hundred digit lottery and if the current lottery result is 20352 (3 is small),  it will win lottery. </p>' +
      '</div>' +
      '<table class="play_dialog_table mce-item-table">' +
      '<tbody>' +
      '<tr>' +
      '<th>Big</th>' +
      '<th>Small</th>' +
      '</tr>' +
      '<tr>' +
      '<td>5、 6、 7、 8、 9</td>' +
      '<td>0、 1、 2、 3、 4</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '<div>' +
      '<h3>◎How to play  Dragon and Tiger</h3>' +
      '<p class="ml25"><strong>Dragon：</strong>The draw number of the first place  (Ten thousand digit) draw is more than the draw number of the fifth place (Units digit). If the numbers are the same then it is a draw. For example: the first  place result is 4, the fifth place result is 2 ； The first place  result is 9, the fifth place is 8 ； The first place result is 5, the fifth place is 1 The winner was a dragon.</p>' +
      '<p class="ml25"><strong>Tiger：</strong>The draw number of the first place  (Ten thousand digit) drawn is less than the drawn number of the fifth place   (Units digit). If the numbers are the same then it is a draw. For example: the first place  result is 7, the fifth place result is 9 ；The first place result is 3, the fifth place  is 5 ； The first place result is 5, the fifth place  is 8 The winner was a Tiger.</p>' +
      '<p class="ml25"><strong>Draw：</strong>The draw number of the first place  (Ten thousand digit) drawn is less than the drawn number of the fifth place   (Units digit). If the numbers are the same then it is a draw. For example: the first place  result is 7, the fifth place result is 9 ；The first place result is 3, the fifth place  is 5 ； The first place result is 5, the fifth place  is 8 The winner was a Tiger.</p>' +
      '</div>' +
      '<div>' +
      '<h3>◎ How to play the sum</h3>' +
      '<p class="ml25"><strong>Sum of big：</strong>The sum of the 5 numbers in the lottery result is more than or equal to 23 is the sum of big.※Example: The player bets sum of big  and if the lottery result is 28 , it win lottery.</p>' +
      '<p class="ml25"><strong>Sum of small：</strong>The sum of the 5 numbers in the lottery result is less than or equal to 22 is the sum of small.※Example: The player bets sum of small  and if the lottery result is 18 , it win lottery.</p>' +
      '<p class="ml25"><strong>Sum of odd：</strong>The sum of the 5 numbers in the lottery result is an odd number.※Example: The player bets sum of odd  and if the lottery result is 29 , it win lottery.</p>' +
      '<p class="ml25"><strong>Sum of even：</strong>The sum of the 5 numbers in the lottery result is an even number.※Example: The player bets sum of even  and if the lottery result is 18, it win lottery.</p>' +
      '</div>' +
      '<h3>◎Bullfighting: The winning numbers are in no particular order</h3>' +
      '<p><strong>Niu Niu：</strong>Based on the number of balls drawn from the first to fifth balls of the lottery result, any combination of three numbers is a multiple of 0 or 10, and the sum of the remaining two numbers is taken as the point (minus 10 if it is more than 10) Numbers are used as the base for the prize, such as: 00026 is a cow 8, 02818 is a cow 9, 68628 and 23500 are cowcow 10, commonly known as cows; 26378, 15286 can not be combined into multiples of 0 or 10 because any three numbers are called no cows. , Note: When the five numbers are the same, only 00000 is regarded as a cow, and the other 11111, 66666, etc. are regarded as no cow)</p>' +
      '<p><strong>ฺBigSmal：</strong>Big cow (cow 6, cow 7, cow 8, cow 9, cowcow), Small cow (cow 1, cow 2, cow3, cow 4, cow5), if the bullfighting result is no cow, then bet Big cow and small cow, are not winning.</p>' +
      '<p><strong>OddEven：</strong> Odd cow (cow1, cow 3, cow5, cow7, cow 9), Even cow (cow2, cow 4, cow6, cow8, cowcow), if the result of the bullfight is no cow then bet odd cow and even cow, are not winning.</p> ' +
      '<h3>◎Stud Poker : Does not divide the numbering sequence.</h3>' +
      '<p><strong>Straight Flush：</strong> All five numbers are the same, for example 22222, 66666, 88888 Stud Poker: Straight Flush  is won, the other numbers are not won.。</p>' +
      '<p><strong>Four of a Kind：</strong> Four in the five drawn numbers are the same. For example: 22221, 66663, 88885 Stud Poker bets: Four of a Kind is won, the other numbers are not won.</p>' +
      '<p><strong>Full house：</strong> The result of the draw is three out of the five numbers drawn the same (Three of a kind) and the other two numbers are the same (1 pair). Ex: 22211, 66633 Stud Poker bets: Full house is won, the other numbers are not won.</p>' +
      '<p><strong>Straight：</strong> Five numbers drawn at random are drawn in ascending order (numbers 9, 0, 1 are connected). For example: 23456, 89012, 90123 Stud Poker Betting : Straight is won, the other numbers are not <won class=""></won></p>' +
      '<p><strong>Three of a kind：</strong>Three of the five numbers drawn are the same and the other two numbers are different. For example: 22231, 66623, 88895 Stud Poker bets: Three of a kind Straight is won, the other numbers are not won.</p>' +
      '<p><strong>Two Pairs：</strong>The winning result has two sets of the same number of five numbers. For example: 22166, 66355, 82668 Stud Poker bets: two Pairs Straight is won, the other numbers are not won.</p>' +
      '<p><strong>One pair：</strong>The result of the draw is only one pair out of five identical numbers, for example 22168, 66315, 82968 Stud Poker bets: One pair is won, the other numbers are not won.</p>' +
      '<p><strong>High Card：</strong>The result of the winning numbers is not Straight Flush, Four of a Kind, Full House, Three of a kind, straight ,two Pairs and one pair such as: 23186, 13579, 21968 Stud Poker bets : High card is won, the other numbers are not won.</p>' +
      '<h3>◎How to play the first three digits specials: Three of a kind > straight  > Pair > half straight > not straight  </h3>' +
      '<p><strong>Three of a kind：</strong> The winning numbers [Ten thousand, Thousand, Hundred] are all the same. If the winning numbers are: 222XX, 666XX, 888XX... [Ten thousand, Thousand, Hundred] all the same. The first three digits bets are won and the other numbers are not won.</p>' +
      '<p><strong>straight：</strong> Prize drawn numbers [Ten thousand, Thousand, Hundred] All consecutively regardless of order (numbers 9, 0, 1 consecutively) if the drawn numbers are: 123XX, 901XX, 321XX, 798XX... [Ten thousand, Thousand, Hundred] all in a row The first three bets straight win. Other numbers are not <awarded class=""></awarded></p>' +
      '<p><strong>Pair：</strong> Any two digit prize drawn numbers [Ten Thousands, Thousands, Hundreds] are drawn the same (excluding Three of a kind) if the drawn numbers are: 001XX, 288XX, 696XX... [Ten thousand, Thousand, Hundreds]. two same numbers the first three digits pair bets are won and the other numbers are not won. If the winning number is the first three digits straight It shall be deemed that the first three digits pair are not <awarded class=""></awarded></p>' +
      '<p><strong>half straight ：</strong> Any two digit drawn numbers [Ten thousand, Thousand, Hundred] consecutively unsorted (excluding straight and pair) if the drawn number is: 125XX, 540XX, 390XX, 160XX... Two numbers in [Ten Thousands, Thousands, Hundreds] consecutively, the first three digits half straight bet wins. Other numbers are not awarded. If the number drawn is the first three digits straight bets and the first three digits pair. It shall be deemed , that the first three digits half straight are not awarded. If the prize number drawn is 123XX, 901XX, 556XX, 233XX..., it will not be awarded.</p>' +
      '<p><strong>Not straight：</strong> Excluding all drawn numbers of three of a kind, straight  , pair , half straight. If the drawn numbers are: 157XX, 268XX...the numbers of the lottery are not related, the first three digits Not straight bets win and the other numbers are not won.</p>' +
      '<h3>◎How to play the middle three digits  special : Three of a kind> straight  >Pair> half straight> not straight  </h3>' +
      '<p><strong>Three of a kind：</strong> The winning numbers [thousands, hundred, ten] are all the same. If the numbers drawn are: X222X, X666X, X888X... [thousands, hundred, ten] numbers are the same, the middle three digits straight bet wins. Other numbers are not awarded.</p>' +
      '<p><strong>straight：</strong> The winning numbers [thousands, hundreds, ten] in a row regardless of order (numbers 9, 0, 1 in a row) if the drawn numbers are: X123X, X901X, X321X, X798X... [Thousand Hundred Ten] in a row, middle three bet wins. Other numbers are not awarded.</p>' +
      '<p><strong>Pair：</strong> Any two digits drawn of [thousands, hundred, ten] are the same (excluding three of a kind) if the drawn numbers are: X001X, X288X, X696X... two digits [thousands, hundred, ten]. ] Same, the middle three digits pairs bets are won and the other numbers are not won. If the number drawn is a the middle three digits three of a kind it will wins, so the middle three digits pairs bets are not <won class=""></won></p>' +
      '<p><strong>half straight：</strong> Any two-digit winning number of [Thousands, Hundreds, Tens] is arranged in any particular order. (Excluding straight and pair) if the drawn number is: X125X, X540X, X390X, X160X...[thousands, hundreds, tens] of a two-digit consecutive number. Bets on the middle three digits half straight will be won and the other numbers will not be won. If the number drawn is a middle three digits straight, middle three digits pair, three. Therefore, on the middle three digits half straight bets will not win if the drawn numbers are: X123X, X901X, X556X, X233X... will not be considered won.</p>' +
      '<p><strong>Not straight：</strong> Excluding all drawn numbers of three of a kind, straight  , pair , half straight. If the drawn numbers are: X157X、X268X...the numbers of the lottery are not related, the middle three digits not straight bets win and the other numbers are not won.</p>' +
      '<h3>◎How to play the last three digits special: Three of a kind> straight  >Pair> half straight> not straight  </h3>' +
      '<p><strong>Three of a kind：</strong> The winning number of [Hundreds, Tens, Units] are all the same numbers. If the drawn numbers are: XX222, XX666, XX888... [Hundreds, Tens, Units] are the same, the last three digits three of a kind bet wins and other numbers not win.</p>' +
      '<p><strong>Straight：</strong> The winning numbers of [Hundreds, Tens, Units] are consecutive regardless of order (numbers 9, 0, 1 are connected) if the drawn numbers are: XX123, XX901, XX321, XX798... numbers. [Hundreds, Tens, Units] are in a row, so the last three digits straight bet wins and the other numbers don\'t win.</p>' +
      '<p><strong>Pair：</strong> The winning number of any two digits of [Hundreds, Tens, Units] is the same (excluding three of a kind) if the drawn numbers are: XX001, XX288, XX696... Two digits in [Hundreds, Tens, Units. ] so the last three digits pair  bet wins and the other numbers do not win. If the number issued is the last three digits three of a kind It is deemed that the last three digits pair  are not awarded.</p>' +
      '<p><strong>half straight：</strong> The winning number of any two digits of [Hundreds, Tens, Units] in any particular order. If the drawn numbers are: XX125, XX540, XX390, XX160... [[Hundreds, Tens, Units]] concatenate with two numbers. Therefore, the last three half straight bet wins. Other numbers are not awarded. If the number drawn is the last three digits straight , the last three digits  pairs Therefore, the last three digits half straight bets are not rewarded. If the lottery number is: XX123, XX901, XX556, XX233..., it is not won.</p>' +
      '<p><strong>Not straight：</strong> Excluding all drawn numbers of three of a kind, straight  , pair , half straight. If the drawn numbers are: XX157, XX268.....the numbers of the lottery are not related, , the last three digits not straight bets win and the other numbers are not won.</p>',
    bet_rule: 'Please select the top bet type',
    select_less: 'Choose no less than',
    select_more: 'No more than',
    select_ge: 'Piece',

  }
}
