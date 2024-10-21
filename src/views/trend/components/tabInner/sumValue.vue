<script setup>
import { issueDisplay } from '@/util/tools';

const titlesArray = ['冠亚和值', '前三和值'];
const { resultHistory } = defineProps({
    resultHistory: Array
});
</script>

<template>
    <div class="tableLayout">
        <table class="table">
            <thead>
                <tr class="header">
                    <th class="headerItem firstHeaderItem">期号</th>
                    <th class="headerItem" v-for="title in titlesArray" :key="title">
                        <div class="verticalTitle">
                            <span>{{ title }}</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody class="tableBody">
                <tr class="bodyItem" v-for="{ lotteryNum, results } in resultHistory" :key="lotteryNum">
                    <td class="text-[#63666F] text-sm">{{ issueDisplay(lotteryNum) }}</td>
                    <td class="text-[#63666F] text-sm">
                        {{ Number(results[0]) + Number(results[1]) }}
                    </td>
                    <td class="text-[#63666F] text-sm">
                        {{ Number(results[0]) + Number(results[1]) + Number(results[2]) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
.tableLayout {
    height: calc(100dvh - 218px);
    overflow-y: scroll;
}
.table {
    width: 100%;
    border-collapse: collapse;

    .header {
        height: 60px;
        th {
            border-left: 0.5px solid #e9e9e9;
            background-color: #f5f5f5;
            text-align: center;
            padding: 4px;
            font-size: 14px;
            font-weight: 400;
            color: #63666f;
            position: sticky;
            top: 0;

            &:first-child {
                width: 76px;
                border-left: none;
            }

            .verticalTitle {
                display: flex;
                flex-direction: column;
            }
        }
    }
}
.tableBody {
    /* max-height: calc(100dvh - 280px); */
    height: calc(100dvh - 280px);
    overflow-y: auto;

    .bodyItem {
        &:nth-child(even) {
            background-color: #f5f5f5;
        }

        td {
            text-align: center;
            color: #63666f;
            padding: 4px;
            border-left: 0.5px solid #0000001a;
            font-size: 14px;

            &:first-child {
                width: 76px;
                border-left: none;
            }
        }

        &:last-child {
            border-bottom: 0.5px solid #0000001a;
        }
    }
}
</style>
