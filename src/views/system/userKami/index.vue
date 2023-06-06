<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">过期时间</label>
        <el-input v-model="query.expirationTime" clearable placeholder="过期时间" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">是否使用</label>
        <el-select v-model="query.status" filterable placeholder="请选择" style="margin: 0 3px 10px 0;vertical-align: middle;">
          <el-option
            v-for="item in dict.kami_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">卡密类型</label>
        <el-select v-model="form.type" filterable placeholder="请选择" style="margin: 0 3px 10px 0;vertical-align: middle;">
          <el-option
            v-for="item in dict.kami_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <template slot="right">
          <el-button
            v-if="crud.optShow.del"
            slot="reference"
            v-permission="permission.del"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :loading="crud.delAllLoading"
            @click="delExpirationKaMi()"
          >
            删除过期卡密
          </el-button>
        </template>
      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="过期时间" prop="expirationTime">
            <el-date-picker v-model="form.expirationTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="卡密类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.kami_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="兑换数量" prop="number">
            <el-input v-model="form.number" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="生成数量" prop="number">
            <el-input v-model="form.generateNumber" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="kaMi" label="卡密号" />
        <el-table-column prop="expirationTime" label="过期时间" />
        <el-table-column prop="status" label="是否使用">
          <template slot-scope="scope">
            {{ dict.label.kami_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="卡密类型">
          <template slot-scope="scope">
            {{ dict.label.kami_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="兑换数量" />
        <el-table-column v-if="checkPer(['admin','userKami:edit','userKami:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudUserKami, { delExpirationKaMi } from '@/api/system/userKami'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, kaMi: null, expirationTime: null, createTime: null, updateTime: null, status: null, useId: null, type: null, number: null, generateNumber: null }
export default {
  name: 'UserKami',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['kami_status', 'kami_type'],
  cruds() {
    return CRUD({ title: '卡密', url: 'api/userKami', idField: 'id', sort: 'id,desc', crudMethod: { ...crudUserKami }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'userKami:add'],
        edit: ['admin', 'userKami:edit'],
        del: ['admin', 'userKami:del'],
        delExpirationKaMi: ['admin', 'userKami:del']
      },
      rules: {
        expirationTime: [
          { required: true, message: '过期时间不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '是否使用 Y/N不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '卡密类型（积分，会员）不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '兑换数量不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'expirationTime', display_name: '过期时间' },
        { key: 'status', display_name: '是否使用 Y/N' },
        { key: 'type', display_name: '卡密类型（积分，会员）' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    delExpirationKaMi() {
      this.$confirm(`确认删除已过期和已使用的卡密数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExpirationKaMi()
        this.crud.refresh()
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>

</style>
