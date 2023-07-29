<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">消息类型</label>
        <el-select v-model="query.messageType" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.message_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">消息源</label>
        <el-select v-model="query.messageSource" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.message_source"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!--        <label class="el-form-item-label">消息内容</label>-->
        <!--        <el-input v-model="query.messageText" clearable placeholder="消息内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <label class="el-form-item-label">ip</label>
        <el-input v-model="query.requestIp" clearable placeholder="ip" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">ip地址</label>
        <el-input v-model="query.ipAddress" clearable placeholder="ip地址" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">用户名</label>
        <el-input v-model="query.username" clearable placeholder="用户名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">创建时间</label>
        <date-range-picker
          v-model="query.createTime"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          class="date-item"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="消息类型" prop="messageType">
            <el-select v-model="form.messageType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.message_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="消息内容" prop="messageText">
            <el-input v-model="form.messageText" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <!--          <el-form-item label="ip" prop="requestIp">-->
          <!--            <el-input v-model="form.requestIp" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="ip地址" prop="ipAddress">-->
          <!--            <el-input v-model="form.ipAddress" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <el-form-item label="消息源" prop="messageSource">
            <el-select v-model="form.messageSource" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.message_source"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <el-table-column prop="messageType" label="消息类型">
          <template slot-scope="scope">
            {{ dict.label.message_type[scope.row.messageType] }}
          </template>
        </el-table-column>
        <el-table-column prop="messageText" label="消息内容" />
        <el-table-column prop="requestIp" label="ip" />
        <el-table-column prop="ipAddress" label="ip地址" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="messageSource" label="消息源">
          <template slot-scope="scope">
            {{ dict.label.message_source[scope.row.messageSource] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','chatMessage:edit','chatMessage:del'])" label="操作" width="150px" align="center">
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
import crudChatMessage from '@/api/chatMessage'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { messageId: null, messageType: null, messageText: null, requestIp: null, ipAddress: null, username: null, createTime: null, messageSource: null }
export default {
  name: 'ChatMessage',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['message_type', 'message_source'],
  cruds() {
    return CRUD({ title: 'chat消息记录', url: 'api/chatMessage', idField: 'messageId', sort: 'createTime,desc', crudMethod: { ...crudChatMessage }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'chatMessage:add'],
        edit: ['admin', 'chatMessage:edit'],
        del: ['admin', 'chatMessage:del']
      },
      rules: {
        messageType: [
          { required: true, message: '消息类型不能为空', trigger: 'blur' }
        ],
        messageText: [
          { required: true, message: '消息内容不能为空', trigger: 'blur' }
        ],
        messageSource: [
          { required: true, message: '消息源不能为空', trigger: 'blur' }
        ]
        // requestIp: [
        //   { required: true, message: 'ip不能为空', trigger: 'blur' }
        // ],
        // ipAddress: [
        //   { required: true, message: 'ip地址不能为空', trigger: 'blur' }
        // ],
      },
      queryTypeOptions: [
        { key: 'messageType', display_name: '消息类型' },
        { key: 'messageText', display_name: '消息内容' },
        { key: 'requestIp', display_name: 'ip' },
        { key: 'ipAddress', display_name: 'ip地址' },
        { key: 'username', display_name: '用户名' },
        { key: 'messageSource', display_name: 'messageSource' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
