(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (memory $0 0)
 (export "midpoint" (func $asm/index/midpoint))
 (export "memory" (memory $0))
 (func $asm/index/midpoint (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.const 2
  i32.div_s
  local.get $1
  i32.const 2
  i32.div_s
  i32.add
 )
)
